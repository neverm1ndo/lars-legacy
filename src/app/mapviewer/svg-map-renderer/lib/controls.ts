import { filter, fromEvent, Subscription, withLatestFrom } from 'rxjs';
import { SVGRenderer } from './renderer';
import { ViewerColntrolMode } from '@lars/mapviewer/domain/entities';

const CURSOR = {
  [ViewerColntrolMode.NONE]: '-webkit-grab',
  [ViewerColntrolMode.DRAG]: '-webkit-grabbing'
};

const MAX_ZOOM_STEP = 20;
const MIN_ZOOM_STEP = 1;

export class SVGRendererViewportControls {
  private controls: Subscription[] = [];
  private viewportRect = this.renderer.viewportContainer.getBoundingClientRect();

  private deltaDrag = {
    start: [0, 0],
    end: [0, 0]
  };

  private zoomStep = MIN_ZOOM_STEP;

  constructor(private renderer: SVGRenderer) {}

  private toggleDragCursor() {
    this.renderer.viewportContainer.style.cursor = CURSOR[this.renderer.modeValue];
  }

  initControls() {
    this.controls.push(
      fromEvent(this.renderer.viewportContainer, 'mousedown').subscribe((event: MouseEvent) => {
        const { pageX, pageY } = event;
        const { left, top } = this.viewportRect;

        this.deltaDrag.start = [pageX - left, pageY - top];

        // this.renderer.setZoom(10);

        this.renderer.mode.next(ViewerColntrolMode.DRAG);
        this.toggleDragCursor();
      }),
      fromEvent(this.renderer.viewportContainer, 'mousemove')
        .pipe(
          withLatestFrom(this.renderer.mode),
          filter(([, mode]) => mode !== ViewerColntrolMode.NONE)
        )
        .subscribe({
          next: ([event, mode]: [MouseEvent, ViewerColntrolMode]) => {
            if (mode === ViewerColntrolMode.DRAG) {
              this.dragEndHandler(event);
            }
          }
        }),
      fromEvent(this.renderer.viewportContainer, 'mouseup').subscribe(() => {
        this.renderer.mode.next(ViewerColntrolMode.NONE);

        // this.renderer.setZoom(1);

        this.toggleDragCursor();
      }),
      fromEvent(this.renderer.viewportContainer, 'wheel').subscribe({
        next: (event: WheelEvent) => this.zoomHandler(event)
      })
    );
  }

  private dragEndHandler(event: MouseEvent): void {
    const {
      start: [startX, startY]
    } = this.deltaDrag;
    const { pageX, pageY } = event;
    const { left, top } = this.viewportRect;
    const [endX, endY] = [pageX - left, pageY - top];
    const [viewportX, viewportY] = this.renderer.viewportOffset.getValue();

    const [deltaX, deltaY] = [startX - endX, startY - endY];

    this.renderer.viewportOffset.next([viewportX + deltaX, viewportY + deltaY]);

    this.deltaDrag.start = [endX, endY];
  }

  private zoomHandler(event: WheelEvent) {
    const { deltaY } = event;
    const direction = -deltaY / 100;

    /**
     * 1 mousewheel down
     * -1 mousewheel up
     */

    if (
      (this.zoomStep < MAX_ZOOM_STEP && direction === 1) ||
      (this.zoomStep > MIN_ZOOM_STEP && direction === -1)
    ) {
      this.zoomStep += direction;

      this.renderer.setZoom(this.zoomStep);
    }
  }

  dismiss() {
    this.controls.forEach((sub) => sub.unsubscribe());
  }
}
