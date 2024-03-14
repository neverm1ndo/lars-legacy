import { ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Flat2dmapService } from '../domain/infrastructure/flat2dmap.service';
import { MAP_IMAGE_URL } from '../domain/configs/map.resources.config';
import { MapObject, ViewerColntrolMode, Viewport } from '../domain/entities';
import { Colors } from '../domain/configs';
import { BehaviorSubject, Subscription, filter, fromEvent, withLatestFrom, takeWhile, switchMap, of, debounceTime, tap, merge, map } from 'rxjs';
import { MapViewerFacade } from '../domain/application/mapviewer.facade';
import { isUndefined } from 'lodash';

const USE_CONTEXT = '2d';
const FPS_LIMIT = 60;
const CIRCLE = 2*Math.PI;
const CIRCLE_SIZE = 5;
const MAX_ZOOM_STEP = 5;
const MIN_ZOOM_STEP = 3;
const ANIMATIONS_FRAMES = 20;
const MAP_IMAGE_SIZE = 6000;

const CURSOR = {
  [ViewerColntrolMode.NONE]: '-webkit-grab',
  [ViewerColntrolMode.DRAG]: '-webkit-grabbing',
};

@Component({
  selector: 'lars-flat2dmap',
  templateUrl: './flat2dmap.component.html',
  styleUrls: ['./flat2dmap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [Flat2dmapService]
})
export class Flat2dmapComponent implements OnInit, OnDestroy {
  @ViewChild('map', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  private resizeObserver: ResizeObserver = new ResizeObserver((_entries: ResizeObserverEntry[]) => {
    this.fitCanvas();
  });

  loading$ = new BehaviorSubject<boolean>(true);

  private mode = new BehaviorSubject<ViewerColntrolMode>(ViewerColntrolMode.NONE);
  private controlsSubscriptions: Subscription[] = [];

  private resources: Record<string, CanvasImageSource> = {};

  get canvasElement(): HTMLCanvasElement {
    return this.canvas.nativeElement;
  }

  private viewport: Viewport = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0
  };

  private positions = {
    old: { x: 0, y: 0 },
    new: { x: 0, y: 0 },
    cursor: { x: 0, y: 0, game: [0, 0] },
    viewport: { x: 0, y: 0 }
  };

  private deltaDrag = {
    start: [0, 0],
    end: [0, 0]
  };

  private zoomStep = MIN_ZOOM_STEP;
  private zoom = 0.2;
  private mapSize = this.zoom * MAP_IMAGE_SIZE;
  private animation = {
    progress: ANIMATIONS_FRAMES,
    direction: -1
  }

  private mapObjects: MapObject[] = [];

  constructor(
    private readonly flat2dmapService: Flat2dmapService,
    private readonly mapViewerFacade: MapViewerFacade,
    private host: ElementRef,
    private readonly zone: NgZone
  ) { }

  private initCanvas(): void {
    this.zone.runOutsideAngular(() => {
      const context = this.canvasElement.getContext(USE_CONTEXT);
      let mapImage: CanvasImageSource = this.resources.map;

      const mapCenter = this.mapSize/2;
      const { width, height } = this.canvasElement;

      this.viewport = {
        x: width/2 - mapCenter,
        y: height/2 - mapCenter,
        dx: this.mapSize,
        dy: this.mapSize
      };

      let then: number = Date.now();
      const interval: number = 1000 / FPS_LIMIT;
      let DELTA: number;
      const times = [];
      let fps: number;

      if (mapImage) {
        context.drawImage(mapImage as CanvasImageSource, 0, 0, this.mapSize, this.mapSize);
      }

      /** Rendering loop */
      const draw = () => {
        window.requestAnimationFrame(draw);

        const now = Date.now();
        DELTA = now - then;
  
        if (DELTA <= interval) return;
  
        then = now - (DELTA % interval);
        clear();

        context.drawImage(mapImage, this.viewport.x, this.viewport.y, this.mapSize, this.mapSize);

        if (this.animation.progress < ANIMATIONS_FRAMES) {
            this.zoom = Math.abs(this.flat2dmapService.getEase(
              this.animation.progress,
              this.zoom,
              0.01*this.animation.direction,
              ANIMATIONS_FRAMES,
              2
            ));
  
            this.mapSize = MAP_IMAGE_SIZE * this.zoom;

            const [gX, gY] = this.positions.cursor.game;
            this.setViewportTo(gX, gY, this.mapSize);

            this.animation.progress++;
        }
        // drawDots();


        drawVisiblePoints(this.mapObjects);
        drawFps();
        drawDebugCursor();
      };

      const drawObjectPoint = (
        [x, y]: number[], 
        { x: viewportX, y: viewportY }: Viewport
      ) => {
        const path = new Path2D();
        context.fillStyle = Colors.OBJECT_POINT;

        path.arc(
          x * this.zoom + viewportX + this.mapSize/2,
          y * -this.zoom + viewportY + this.mapSize/2,
          CIRCLE_SIZE,
          0,
          CIRCLE,
          false
        );
        path.closePath();
        context.fill(path);
      };

      const drawVisiblePoints = (objects: MapObject[]) => {
        for(const { posX, posY } of objects) {
          drawObjectPoint([posX, posY], this.viewport);
        }
      }
      
      const clear = () => {
        const { width, height } = this.canvasElement;
        context.clearRect(0, 0, width, height);
      };

      const drawFps = () => {
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
          times.shift();
        };
        times.push(now);
        fps = times.length;
        context.fillStyle = Colors.WHITE;
        context.fillText(`${fps} FPS`, 20, context.canvas.clientHeight - 20);
      };

      const drawDebugCursor = () => {
        const path = new Path2D();
        const { x, y } = this.positions.cursor;
        const [gX, gY] = this.positions.cursor.game;
        const { x: viewportX, y: viewportY } = this.viewport;
        const { width, height } = this.canvasElement;

        path.arc(
          x,
          y,
          3,
          0,
          CIRCLE,
          false
        );

        context.fillStyle = Colors.WHITE;
        context.fill(path);
        
        path.moveTo(width/2, 0);
        path.lineTo(width/2, height);

        path.moveTo(0, height/2);
        path.lineTo(width, height/2);

        context.strokeStyle = Colors.WHITE + '40';
        context.stroke(path);

        context.fillText(`game: ${gX}, ${gY}`, x, y - 15);
        context.fillText(`ac: ${x}, ${y}`, x, y - 25);
        context.fillText(`viewport: ${viewportX}, ${viewportY}`, x, y - 35);
        context.fillText(`zoom: x${this.zoomStep}, ${this.zoom}`, x, y - 45);
        context.fillText(`max: ${MAX_ZOOM_STEP}, min: ${MIN_ZOOM_STEP}`, x, y - 55);

      };

      draw();
    });
  }

  private setViewportTo(x: number, y: number, mapSize?: number): void {
    const mapCenter = this.mapSize/2;

    const { width, height } = this.canvasElement;

    this.viewport.x = (width/2 - mapCenter) + (-x*this.zoom);
    this.viewport.y = (height/2 - mapCenter) + (y*this.zoom);
    
    if (mapSize) {
      this.viewport.dx = mapSize;
      this.viewport.dy = mapSize;
    }

  }

  private fitCanvas(): void {
    this.zone.runOutsideAngular(() => {
      this.canvasElement.width = this.host.nativeElement.offsetWidth;
      this.canvasElement.height = this.host.nativeElement.offsetHeight;
    });
  }

  private loadResources(): void {
    this.loading$.next(true);
    
    this.flat2dmapService.loadResourceImages(
      [
        { name: 'map', src: MAP_IMAGE_URL }
      ]
    ).then((resources) => {
      this.resources = resources;
      this.loading$.next(false);
      
      this.initCanvas();
      this.initControls();
    });
  }

  private initControls(): void {
    this.controlsSubscriptions.push( 
      fromEvent(window, 'keydown').pipe(
        filter((event: KeyboardEvent) => event.key === 'Delete'),
        withLatestFrom(this.mapViewerFacade.isSomeObjectSelected()),
        filter(([, isSelected]) => isSelected)
      )
      .subscribe(() => {
        this.mapViewerFacade.removeObject();
      }),
      fromEvent(this.canvasElement, 'mousemove')
      .pipe(
        tap((event: MouseEvent) => {
          if (this.animation.progress === ANIMATIONS_FRAMES) {
            this.positions.cursor.x = event.offsetX;
            this.positions.cursor.y = event.offsetY;
            this.positions.cursor.game = [
              (this.viewport.x - (this.canvasElement.width - this.mapSize)/2)/-this.zoom,
              (this.viewport.y - (this.canvasElement.height - this.mapSize)/2)/this.zoom,
            ];
          }
        }),
        withLatestFrom(this.mode),
        filter(([, mode]) => mode !== ViewerColntrolMode.NONE),
      ).subscribe({
        next: ([event, mode]: [MouseEvent, ViewerColntrolMode]) => {
          if (mode === ViewerColntrolMode.DRAG) {
            this.dragEndHandler(event);
          }
        }
      }),
      fromEvent(this.canvasElement, 'mousedown').subscribe((event: MouseEvent) => {
        const { pageX, pageY } = event;
        const { offsetLeft, offsetTop } = this.canvasElement;

        this.deltaDrag.start = [
          pageX - offsetLeft,
          pageY - offsetTop
        ];
        
        this.mode.next(ViewerColntrolMode.DRAG);
        this.toggleDragCursor();
      }),
      fromEvent(this.canvasElement, 'mouseup').subscribe(() => {
        this.mode.next(ViewerColntrolMode.NONE);

        this.toggleDragCursor();
      }),
      fromEvent(this.canvasElement, 'wheel')
        .pipe(
          filter(() => this.animation.progress === ANIMATIONS_FRAMES),
        )
        .subscribe((event: WheelEvent) => this.handleMouseWheel(event)),
      fromEvent(this.canvasElement, 'mouseleave').subscribe(() => {
        this.mode.next(ViewerColntrolMode.NONE);

        this.toggleDragCursor();
      })
    );
  }

  private dragEndHandler(event: MouseEvent): void {
    const { start: [startX, startY] } = this.deltaDrag;
    const { pageX, pageY } = event;
    const { offsetLeft, offsetTop } = this.canvasElement;

    const [endX, endY] = [
      pageX - offsetLeft,
      pageY - offsetTop
    ];

    this.viewport.x -= startX - endX;
    this.viewport.y -= startY - endY;

    this.positions.viewport = { 
      x: this.viewport.x,
      y: this.viewport.y
    }

    this.deltaDrag.start = [endX, endY];
  }

  private handleMouseWheel(event: WheelEvent): void {
    const { deltaY } = event;
    const direction = -deltaY/100;
    
    /**
     * 1 mousewheel down
     * -1 mousewheel up
     */
    if (
      (this.zoomStep <= MAX_ZOOM_STEP && direction === 1) || 
      (this.zoomStep > MIN_ZOOM_STEP && direction === -1)
    ) {
      this.zoomStep += direction;

      this.zoomMap(direction);
    }
  }

  private zoomMap(direction: number): void {
    this.animation.progress = 0;
    this.animation.direction = direction;
  }

  private toggleDragCursor() {
    this.canvasElement.style.cursor = CURSOR[this.mode.getValue()];
  }

  ngOnInit(): void {
    this.resizeObserver.observe(this.host.nativeElement);
    this.loadResources();

    this.controlsSubscriptions.push(
      merge(
        this.mapViewerFacade.getCurrentMapObjects().pipe(
          tap((objects) => { this.mapObjects = objects }),
          map((objects) => objects.findIndex(
              ({ posX, posY }) => posX && posY)
          ),
        ),
        this.mapViewerFacade.getSelectedObjectIndex().pipe(
          filter((index) => !isUndefined(index))
        )
      ).subscribe((index) => {
        const { posX = 0, posY = 0 } = this.mapObjects[index];

        this.setViewportTo(posX, posY);
      })
    );
  }

  ngOnDestroy(): void {
    this.controlsSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.mapViewerFacade.clearObjects();
  }
}
