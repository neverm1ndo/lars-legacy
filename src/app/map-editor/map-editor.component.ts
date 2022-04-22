import { Component, OnInit, ElementRef, ViewChild, HostListener, NgZone } from '@angular/core';
import Keys from '../enums/keycode.enum';
import { EditorMode } from '../enums/map.editor.enum';
import { MapObject, Viewport } from '../interfaces/map.interfaces';

const { LeftArrow, RightArrow } = Keys;

type Position2 = {
  x: number;
  y: number;
}

interface RectangleVertices {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

@Component({
  selector: 'map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.scss']
})
export class MapEditorComponent implements OnInit {

  private _objects: MapObject[] = [];
  private d_objects: MapObject[];
  private objectsToDraw: MapObject[] = [];
  private ZOOM: number = 0.2;

  set objects (newObjects: MapObject[]) {
    this._objects = newObjects;
    this.objectsToDraw = this._objects.map(obj => Object.assign({...obj}));
    if (this.objectsToDraw.length > 400) this.objectsToDraw = this.removeDoubles(this.objectsToDraw, 10);
    console.log(`drawed ${this.objectsToDraw.length} dots`)
    if (this.canvas.nativeElement) this.viewportTo(this._objects[1].posX, this._objects[1].posY);
    this.viewport = {
      x: (-this.imgSize/2+this.canvas.nativeElement.width/2)+(this._objects[1].posX*-this.ZOOM),
      y: (-this.imgSize/2+this.canvas.nativeElement.height/2)+(this._objects[1].posY*this.ZOOM),
      dx: this.imgSize,
      dy: this.imgSize
    };
    this.positions = {
      old: { x: 0, y: 0 },
      new: { x: 0, y: 0 },
    };
    this.d_objects = this._objects.map(obj => Object.assign({...obj}));
    this.radius = null;
    this.arcCenter = null;
    this.origin = null;
    this.deg = 0;
  }

  get objects() {
    return this._objects;
  }

  mode: EditorMode = EditorMode.VIEW;

  @ViewChild('map', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @HostListener('window:resize', ['$event']) onResize() {
    this.zone.runOutsideAngular(() => {
      this.canvas.nativeElement.width = this.hostElem.nativeElement.offsetWidth;
      this.canvas.nativeElement.height = this.hostElem.nativeElement.offsetHeight;
    });
  }
  @HostListener('document:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (this.mode == EditorMode.ROTATE) {
      switch (event.keyCode) {
        case LeftArrow: this.deg+=Math.PI/180; break;
        case RightArrow: this.deg-=Math.PI/180; break;
        default: break;
      }
    }
  }
  map: any;
  imgSize: number = 6000 * (this.ZOOM);
  viewport: Viewport = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0
  };
  dots: any;
  positions = {
    old: { x: 0, y: 0 },
    new: { x: 0, y: 0 },
  };
  changed: boolean = false;
  ctr: any;
  radius: number;
  arcCenter: Position2;
  origin: Position2;
  deg: number = 0;

  constructor(
    private hostElem: ElementRef,
    private zone: NgZone,
  ) {}

  removeDoubles(objects: MapObject[], maxDistance: number): MapObject[] {
    for(let i = 0; i < objects.length; i++) {
      const object: MapObject = objects[i];
      if (!object) break;
      if (object.name == 'meta' || object.name == 'texture') continue;
      for (let j = i; j < objects.length - i; j++) {
        const next: MapObject = objects[j];
        if (this.getDistanceBetweenObjects(object, next) < maxDistance) objects.splice(j, 1);
      }
    }
    return objects;
  }

  getDistanceBetweenObjects(a: MapObject, b: MapObject): number {
    return Math.sqrt(Math.pow(b.posX - a.posX, 2) + Math.pow(b.posY - a.posY, 2) + Math.pow(b.posZ - a.posZ, 2));
  }

  filter(objects: any[]): any[] {
    return objects.filter((obj) => obj.name !== 'material' && obj.name !== 'text');
  }

  changePosZ(diff: number): void {
    this._objects.forEach((obj: any) => {
      if (obj.posZ) obj.posZ = Number((+obj.posZ + diff).toFixed(4));
    });
  }

  isChanged(posStart: any, posEnd: any): boolean {
    return !this.changed && (((posStart.x - posEnd.x) === 0) || ((posStart.y - posEnd.y) === 0));
  }

  toFloat32Array(objects: MapObject[]): Float32Array {
    const arr = [];
    objects.forEach((obj: MapObject) => {
      arr.push(Object.values(obj).slice(2, 8));
    });
    return new Float32Array(arr);
  }

  getAverage(key: keyof Omit<MapObject, 'id' | 'name' | 'dimension' | 'model' | 'interior'>): number {
    let count = 0;
    const res = this._objects.reduce((acc, obj) => {
      if (obj[key]) {
        count++;
        return acc + obj[key];
      } else {
        return acc;
      }
    }, 0);
    return Number((res/count).toFixed(4));
  }

  /**
  * Ease-In animation
  */
  easeIn(currentProgress: number, start: number, distance: number, steps: number, power: number): number {
    currentProgress /= steps/2;
    if (currentProgress < 1) return (distance/2)*(Math.pow(currentProgress, power)) + start;
    currentProgress -= 2;
    return distance/2*(Math.pow(currentProgress,power)+2) + start;
  }

  viewportTo(x: number, y: number): void {
    this.viewport.x = (-this.imgSize/2+this.canvas.nativeElement.width/2)+(+x*-this.ZOOM);
    this.viewport.y = (-this.imgSize/2+this.canvas.nativeElement.height/2)+(+y*this.ZOOM);
  }
/* istambul ignore mapView: PROTOTYPE ONLY */
  mapView(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    let drag: boolean = false;
    let move: boolean = false;
    let rotate: boolean = false;
    let dragStart: any;
    let dragEnd: any;

    const getImageSize = () => {
      return this.imgSize;
    };

    /* istambul ignore else */
    if (!this.map) {
      this.map = new Image(getImageSize(), getImageSize());
      this.map.src = 'lars://assets/images/sa_map4k.webp';
      this.map.onload = () => {
        draw();
      };
    } else {
      ctx.drawImage(this.map, 0, 0, getImageSize(), getImageSize());
    }

    const clear = () => {
      ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    };

    const zoomInOut = (event: WheelEvent) => {
      const delta: number = -event.deltaY/100;
      const UP = 1;
      const DOWN = -1;
      if (((delta == UP) && this.ZOOM >= 0.8 ) || ((delta == DOWN) && this.ZOOM <= 0.1)) return;
      this.ZOOM = Number((this.ZOOM + (delta*0.1)).toFixed(1));
      this.imgSize = 6000 * (this.ZOOM);
      this.viewport = {
        x: (-this.imgSize/2+this.canvas.nativeElement.width/2)+(this._objects[1].posX*-this.ZOOM),
        y: (-this.imgSize/2+this.canvas.nativeElement.height/2)+(this._objects[1].posY*this.ZOOM),
        dx: this.imgSize,
        dy: this.imgSize
      };
    };

    const drawPositionSigns = () => {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ffffff';
      ctx.fillText(`ZOOM: x${this.ZOOM*10}`, 20, ctx.canvas.clientHeight - 40);
    }

    const drawDots = () => {
      ctx.fillStyle = '#d63b50';
      this.objectsToDraw.forEach((obj: MapObject) => {
         const path = new Path2D();
         path.arc(obj.posX * this.ZOOM + this.viewport.x + this.imgSize/2, obj.posY * -this.ZOOM + this.viewport.y + this.imgSize/2, 7, 0, 2 * Math.PI, false);
         path.closePath();
         ctx.fill(path);
       });
     };
     /* istambul ignore next */
     /** Jarvis algorithm https://ru.algorithmica.org/cs/convex-hulls/jarvis/
     * @param {Array<MapObject>} objects map objects array typeof Array<MapObject>
     * @returns {RectangleVertices} object with vertices of the rectangle
     */
     const jarvis = (objects: MapObject[]): RectangleVertices => {
       function getLeft(objs: MapObject[]) {
          objs.sort((a, b) => { if (a.posX && b.posX) return a.posX - b.posX });
          if (objs[0].posX) {
            return objs[0];
          } else {
            return objs[1];
          }
       }
       function getTop(objs: MapObject[]) {
         objs.sort((a, b) => { if (a.posY && b.posY) return a.posY - +b.posY });
         return objs[objs.length - 1];
       }
       function getRight(objs: MapObject[]) {
         objs.sort((a, b) => { if (a.posX && b.posX) return a.posX - +b.posX });
         return objs[objs.length - 1];
       }
       function getBottom(objs: MapObject[]) {
         objs.sort((a, b) => { if (a.posY && b.posY) return a.posY - +b.posY });
         if (+objs[0].posX) {
           return objs[0];
         } else {
           return objs[1];
         }
       }
       this.dots = {
         left: getLeft(objects),
         top: getTop(objects),
         right: getRight(objects),
         bottom: getBottom(objects)
       };
       return this.dots;
     };

     const isOnRect = (x: number, y: number, arc: any) => {
       let centerX = arc.x + arc.radius,
       centerY = arc.y + arc.radius;
       return Math.round(Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))) <= arc.radius;
     };

     const getRectCenter = () => {
       return {
         x: (Number((this.dots.left.posX + this.dots.right.posX).toFixed(4))/2) * this.ZOOM + this.viewport.x + this.imgSize/2,
         y: (Number((this.dots.top.posY + this.dots.bottom.posY).toFixed(4))/2) * -this.ZOOM + this.viewport.y + this.imgSize/2
       }
     }

     const rotateObjects = (): void => {
       for (let i = 0; i < this._objects.length; i++) {
         if (!this._objects[i].posX ) continue;
         this._objects[i].posX = (this.d_objects[i].posX - this.origin.x) * Math.cos(this.deg) - (this.d_objects[i].posY - this.origin.y) * Math.sin(this.deg) + this.origin.x;
         this._objects[i].posY = (this.d_objects[i].posX - this.origin.x) * Math.sin(this.deg) + (this.d_objects[i].posY - this.origin.y) * Math.cos(this.deg) + this.origin.y;
      }
    };

    const rotatePoint = (x: number, y: number, origin: Position2): Position2 => {
      return {
        x: (x - origin.x) * Math.cos(-this.deg) - (y - origin.y) * Math.sin(-this.deg) + origin.x,
        y: (x - origin.x) * Math.sin(-this.deg) + (y - origin.y) * Math.cos(-this.deg) + origin.y
      };
    };

    const getRelativeRotationDegree = (deg: number, delta: number): number => {
      return deg*-delta;
    };

     const moveObjects = (deltaX: number, deltaY: number): void => {
       for (let i = 0; i < this._objects.length; i++) {
         if (!this._objects[i].posX) continue;
         this._objects[i].posX = this._objects[i].posX + deltaX;
         this._objects[i].posY = this._objects[i].posY + deltaY;
       }
     };

     const drawPosDot = (oldPos: Position2, newPos: Position2): void => {
       const path = new Path2D();
       ctx.fillStyle = '#4287f5';
       ctx.strokeStyle = '#4287f5';
       path.arc(oldPos.x , oldPos.y, 3, 0, 2 * Math.PI, false);
       ctx.fill(path);
       path.moveTo(oldPos.x, oldPos.y)
       path.lineTo(newPos.x, newPos.y);
       path.closePath();
       ctx.stroke(path);
       ctx.fillStyle = '#fdfdfd';
       ctx.fillText(`Prev position`, oldPos.x , oldPos.y - 20);
       ctx.fillStyle = '#fdfdfd70';
       ctx.fillText(`${oldPos.x}\n ${oldPos.y}`, oldPos.x , oldPos.y - 10);
     };

     const drawRect = (dots: any) => {
       const path = new Path2D();
       ctx.font = '10px sans-serif'
       ctx.fillStyle = '#fdfdfd70';
       ctx.fillText(`${dots.left.posX} , ${dots.top.posY}`, dots.left.posX * this.ZOOM + this.viewport.x + this.imgSize/2 - 13, dots.top.posY * -this.ZOOM + this.viewport.y + this.imgSize/2 - 20)
       ctx.fillStyle = '#82AAFF30';
       ctx.strokeStyle = '#82AAFF';
       if (move) {
         ctx.fillStyle = '#4287f530';
         ctx.strokeStyle = '#4287f5';
       }
       ctx.lineWidth = 3;
       path.moveTo(dots.left.posX * this.ZOOM + this.viewport.x + this.imgSize/2 - 13, dots.top.posY * -this.ZOOM + this.viewport.y + this.imgSize/2 - 13);
       path.lineTo(dots.left.posX * this.ZOOM + this.viewport.x + this.imgSize/2 - 13, dots.bottom.posY * -this.ZOOM + this.viewport.y + this.imgSize/2 + 13);
       path.lineTo(dots.right.posX * this.ZOOM + this.viewport.x + this.imgSize/2 + 13, dots.bottom.posY * -this.ZOOM + this.viewport.y + this.imgSize/2 + 13);
       path.lineTo(dots.right.posX * this.ZOOM + this.viewport.x + this.imgSize/2 + 13, dots.top.posY * -this.ZOOM + this.viewport.y + this.imgSize/2 - 13);
       path.arc(dots.left.posX * this.ZOOM + this.viewport.x + this.imgSize/2 - 13, dots.top.posY * -this.ZOOM + this.viewport.y + this.imgSize/2 - 13, 3, 0, 2 * Math.PI, false);
       path.closePath();
       ctx.fill(path);
       ctx.stroke(path);
       let center = getRectCenter();
       if (move) {
         ctx.fillStyle = '#82AAFF30';
         ctx.strokeStyle = '#82AAFF';
         ctx.lineWidth = 2;
         if (!this.positions.old.x) {
           this.positions.old = center;
         }
         path.arc(center.x , center.y , 3, 0, 2 * Math.PI, false);
         path.closePath();
         ctx.fill(path);
         ctx.stroke(path);
         ctx.fillText(`Move`, dots.left.posX * this.ZOOM + this.viewport.x + this.imgSize/2 - 13, dots.top.posY * -this.ZOOM + this.viewport.y + this.imgSize/2 - 30)
         drawPosDot(this.positions.old, center);
       }
     }
     const drawRotateArc = (dots: any) => {
       const mainArcPath      = new Path2D();
       const secondaryArcPath = new Path2D();
       const dragDotPath      = new Path2D();
       const anglePath        = new Path2D();
       let center             = this.arcCenter;
       if (!this.arcCenter || !rotate) this.arcCenter = getRectCenter();
       if (!this.radius) {
         this.radius = Math.round(
           Math.sqrt(
             Math.pow((dots.left.posX * this.ZOOM + this.viewport.x + this.imgSize/2) - center.x, 2) +
             Math.pow((dots.left.posY * -this.ZOOM + this.viewport.y + this.imgSize/2) - center.y, 2)
           ));
       }
       let margin: number = 14;
       let marker: Position2 = rotatePoint(center.x, center.y - this.radius - margin, center);
       ctx.fillStyle = '#82AAFF30';
       ctx.strokeStyle = '#82AAFF';
       ctx.lineWidth = 3;
       mainArcPath.arc(center.x , center.y , this.radius + margin, 0, 2 * Math.PI, false);
       mainArcPath.closePath();
       ctx.stroke(mainArcPath);
       dragDotPath.arc(marker.x, marker.y, 4, 0, 2 * Math.PI, false);
       dragDotPath.closePath();
       ctx.fillStyle = '#82AAFF';
       ctx.fill(dragDotPath);
       if (rotate) {
         anglePath.moveTo(marker.x, marker.y);
         anglePath.lineTo(center.x , center.y);
         anglePath.closePath();
         ctx.stroke(anglePath);
         if (this.deg >= 0.001) secondaryArcPath.arc(center.x, center.y, this.radius/2, -0.5*Math.PI, -this.deg + 1.5*Math.PI , true);
         if (this.deg < -0.001) secondaryArcPath.arc(center.x, center.y, this.radius/2, -this.deg - 0.5*Math.PI , -0.5*Math.PI , true);
         ctx.strokeStyle = '#82AAFF50';
         if ((this.deg*180/Math.PI > 360) || (this.deg*180/Math.PI < -360)) ctx.strokeStyle = '#ff000030';
         ctx.lineWidth = this.radius/2 + margin;
         ctx.stroke(secondaryArcPath);
       }
       secondaryArcPath.arc(center.x , center.y , 3, 0, 2 * Math.PI, false);
       secondaryArcPath.closePath();
       ctx.fillStyle = '#ffffff';
       ctx.strokeStyle = '#ffffff';
       ctx.fill();
       ctx.fillText(`Rotate ${Math.round(this.deg*180/Math.PI)}°`, center.x - this.radius - 20, center.y - this.radius - 20);
     };

     this.canvas.nativeElement.addEventListener('mouseenter', function () {
       this.style.cursor = '-webkit-grab';
     });

     this.canvas.nativeElement.addEventListener('mouseleave', function () {
       this.style.cursor = 'pointer';
       drag = false;
       move = false;
       rotate = false;
     });

     this.canvas.nativeElement.addEventListener('mousedown', (event) => {
       this.canvas.nativeElement.style.cursor = '-webkit-grabbing';
       dragStart = {
         x: event.pageX - this.canvas.nativeElement.offsetLeft,
         y: event.pageY - this.canvas.nativeElement.offsetTop
       };
       drag = true;
       if (!this.dots) return;
       switch (this.mode) {
         case EditorMode.ROTATE: {
           move = false;
           switch (event.button) {
             case 0: {
               rotate = true;
               drag = false;
               break;
             }
             case 2: {
               rotate = false;
               drag = true;
               break;
             }
             default: break;
           };
           if (this.isChanged(dragStart, dragEnd)) this.changed = true;
           break;
         }
         case EditorMode.MOVE: {
           if (!isOnRect(event.offsetX, event.offsetY, { x: this.dots.left.posX * this.ZOOM + this.viewport.x + this.imgSize/2 - 23, y: this.dots.top.posY * -this.ZOOM + this.viewport.y + this.imgSize/2 - 23, radius: 10 })) break;
           rotate = false;
           drag = false;
           move = true;
           if (this.isChanged(dragStart, dragEnd)) this.changed = true;
         }
         default: break;
      };
   });
   this.canvas.nativeElement.addEventListener('mouseup', () => {
     drag = false;
     move = false;
     rotate = false;
     this.canvas.nativeElement.style.cursor = '-webkit-grab';
     switch (this.mode) {
       case EditorMode.MOVE: {
         this.d_objects = this._objects.map((obj: MapObject) => Object.assign({...obj}));
         this.origin = {
           x: this.getAverage('posX'),
           y: this.getAverage('posY'),
         };
         break;
       }
       default: break;
     };
   });

   this.canvas.nativeElement.addEventListener('wheel', (event: WheelEvent) => zoomInOut(event));

   this.canvas.nativeElement.addEventListener('mousemove', (event) => {
      dragEnd = {
        x: event.pageX - this.canvas.nativeElement.offsetLeft,
        y: event.pageY - this.canvas.nativeElement.offsetTop
      };
      if ((drag && !move) || (drag && !rotate)) {
        this.viewport.x = this.viewport.x - (dragStart.x - dragEnd.x);
        this.viewport.y = this.viewport.y - (dragStart.y - dragEnd.y);
        if (this.positions.old.x) {
          this.positions.old.x = this.positions.old.x - (dragStart.x - dragEnd.x);
          this.positions.old.y = this.positions.old.y - (dragStart.y - dragEnd.y);
        }
        dragStart = dragEnd;
      }
      if (move) {
        moveObjects(-(dragStart.x - dragEnd.x)/this.ZOOM, (dragStart.y - dragEnd.y)/this.ZOOM);
        dragStart = dragEnd;
        this.origin = getRectCenter();
      }
      if (rotate) {
        if (!this.origin) {
           this.origin = {
             x: this.getAverage('posX'),
             y: this.getAverage('posY')
           };
        }
        this.deg += getRelativeRotationDegree(0.01, (-(dragStart.x - dragEnd.x)));
        rotateObjects();
        dragStart = dragEnd;
      }
    });


    const drawConvexHullMode = () => {
      if (this.mode === EditorMode.ROTATE) drawRotateArc(jarvis(this._objects));
      if (this.mode === EditorMode.MOVE) drawRect(jarvis(this._objects));
    };

    const times = [];
    let fps: number;

    const drawFps = () => {
      const now = performance.now();
      while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
      };
      times.push(now);
      fps = times.length;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ffffff';
      ctx.fillText(`${fps} FPS`, 20, ctx.canvas.clientHeight - 20);
    };

    const FPS_LIMIT: number = 60;
    let then: number = Date.now();
    const interval: number = 1000 / FPS_LIMIT;
    let DELTA: number;

    const draw = () => {
      window.requestAnimationFrame(draw);

      const now = Date.now();
      DELTA = now - then;

      if (DELTA <= interval) return;

      then = now - (DELTA % interval);
      clear();
      ctx.drawImage(this.map, this.viewport.x, this.viewport.y, this.viewport.dx, this.viewport.dy);
      drawDots();
      drawConvexHullMode();
      drawFps();
      drawPositionSigns();
    };
  }

  ngOnInit(): void {
    this.canvas.nativeElement.width = this.hostElem.nativeElement.offsetWidth;
    this.canvas.nativeElement.height = this.hostElem.nativeElement.offsetHeight;
    this.changed = false;
    this.zone.runOutsideAngular(() => {
      this.mapView();
    });
  }
}
