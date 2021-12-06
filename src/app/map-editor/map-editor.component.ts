import { Component, OnInit, ElementRef, ViewChild, HostListener, Input, Output, EventEmitter } from '@angular/core';

interface Viewport {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

class Vector2 {
  public x: number = 0;
  public y: number = 0
  constructor(x: number, y: number) {
    console.log(x);
    this.x = +x;
    this.y = +y;
  }
  get module(): number {
    console.log(this.x, this.y);
    return Math.abs(this.x) + Math.abs(this.y);
  }
}

@Component({
  selector: 'map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.scss']
})
export class MapEditorComponent implements OnInit {

  _objects: any[];
  @Input('objects') set objects (newObjects: any[]) {
    this._objects = this.filter(newObjects);
    if (this.canvas.nativeElement) {
      this.viewportTo(this._objects[1].posX, this._objects[1].posY);
    }
  }
  @Input('mode') mode: 'move' | 'rotate' | 'view' = 'view';
  @ViewChild('map', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @Output() changedMap: EventEmitter<string> = new EventEmitter<string>();
  @HostListener('window:resize', ['$event']) onResize() {
    this.canvas.nativeElement.width = this.hostElem.nativeElement.offsetWidth;
    this.canvas.nativeElement.height = this.hostElem.nativeElement.offsetHeight;
  }
  map: any;
  imgSize: number = 2000;
  viewport: Viewport = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0
  }
  dots: any;

  constructor(private hostElem: ElementRef) {}

  filter(objects: any[]): any[] {
    let filtered: any[] = [];
    objects.forEach((obj) => {
      if (obj.name !== 'material' || obj.name !== 'text') {
        filtered.push(obj);
      }
    });
    return filtered;
  }

  easeIn(currentProgress: number, start: number, distance: number, steps: number, power: number) {
    currentProgress /= steps/2;
    if (currentProgress < 1) {
      return (distance/2)*(Math.pow(currentProgress, power)) + start;
    }
    currentProgress -= 2;
    return distance/2*(Math.pow(currentProgress,power)+2) + start;
  }

  private viewportTo(x: number, y: number): void {
    this.viewport.x = (-this.imgSize/2+this.canvas.nativeElement.width/2)+(+x*-0.33);
    this.viewport.y = (-this.imgSize/2+this.canvas.nativeElement.height/2)+(+y*0.33);
  }

  saveChangedMap(map: string) {
    this.changedMap.emit(map);
  }

  mapView(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    let drag: boolean = false;
    let move: boolean = false;
    let rotate: boolean = false;
    let dragStart: any;
    let dragEnd: any;
    let origin: any;
    if (!this.map) {
      this.map = new Image(this.imgSize, this.imgSize);
      this.map.src = './assets/images/sa_map4k.webp';
      this.map.onload = () => {
        draw();
      }
    } else {
      ctx.drawImage(this.map, 0, 0, this.imgSize, this.imgSize);
    }

    const clear = () => {
       ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
     }
     const drawDots = () => {
       this._objects.forEach((obj) => {
         ctx.fillStyle = '#d63b50';
         ctx.strokeStyle = '#fdfdfd';
          ctx.lineWidth = 1;
         ctx.beginPath();
         ctx.arc(+obj.posX * 0.33 + this.viewport.x + this.imgSize/2, +obj.posY * -0.33 + this.viewport.y + this.imgSize/2, 7, 0, 2 * Math.PI, false);
         ctx.closePath();
         ctx.fill();
         ctx.stroke();
       });
     }
     const jarvis = (objects: any[]) => {
       function getLeft(objs: any[]) {
          objs.sort((a, b) => { if (a.posX && b.posX) return a.posX - b.posX })
          if (objs[0].posX) {
            return objs[0];
          } else {
            return objs[1];
          }
       }
       function getTop(objs: any[]) {
         objs.sort((a, b) => { if (a.posY && b.posY) return a.posY - b.posY })
         return objs[objs.length - 1];
       }
       function getRight(objs: any[]) {
         objs.sort((a, b) => { if (a.posX && b.posX) return a.posX - b.posX })
         return objs[objs.length - 1];
       }
       function getBottom(objs: any[]) {
         objs.sort((a, b) => { if (a.posY && b.posY) return a.posY - b.posY })
         if (objs[0].posX) {
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
     }
     const isOnRect = (x: number, y: number, arc: any) => {
        let centerX = arc.x + arc.radius,
        centerY = arc.y + arc.radius;
        return Math.round(Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))) <= arc.radius;
     }
     const getRectCenter = () => {
       return {
         x: ((+this.dots.top.posX + +this.dots.bottom.posX)/2) * 0.33 + this.viewport.x + this.imgSize/2,
         y: ((+this.dots.top.posY + +this.dots.bottom.posY)/2) * -0.33 + this.viewport.y + this.imgSize/2
       }
     }
     const rotateObjects = (deg: number) => {
       // X = x0 + (x - x0) * cos(a) - (y - y0) * sin(a);
       // Y = y0 + (y - y0) * cos(a) + (x - x0) * sin(a);
      // const origin = getRectCenter();
      console.log(deg * 180/Math.PI);
       for (let i = 0; i < this._objects.length; i++) {
         if (this._objects[i].posX) {
              this._objects[i].posX = (+this._objects[i].posX - origin.x) * Math.cos(deg) - (+this._objects[i].posY - origin.y) * Math.sin(deg) + origin.x;
              this._objects[i].posY = (+this._objects[i].posX - origin.x) * Math.sin(deg) + (+this._objects[i].posY - origin.y) * Math.cos(deg) + origin.y;
          }
        }
     }
     const getRelativeRotationDegree = (x: number, y: number) => {
      // const origin = getRectCenter();
      const cursor = {x: x* 0.33 + this.viewport.x + this.imgSize/2, y: y* 0.33 + this.viewport.y + this.imgSize/2}
      const radius = Math.abs(cursor.x - origin.x) + Math.abs(cursor.y - origin.y);
      console.log(cursor, origin, radius);
      return Math.atan((origin.y - cursor.y)/(origin.x - cursor.x));
     }
     const moveObjects = (deltaX: number, deltaY: number) => {
       for (let i = 0; i < this._objects.length; i++) {
         if (this._objects[i].posX) {
              this._objects[i].posX = +this._objects[i].posX + deltaX;
              this._objects[i].posY = +this._objects[i].posY + deltaY;
          }
        }
     }

     const drawRect = (dots: any) => {
       ctx.font = '10px sans-serif'
       ctx.fillStyle = '#fdfdfd70';
       ctx.fillText(`${dots.left.posX} , ${dots.top.posY}`, dots.left.posX * 0.33 + this.viewport.x + this.imgSize/2 - 13, dots.top.posY * -0.33 + this.viewport.y + this.imgSize/2 - 20)
       ctx.fillStyle = '#82AAFF30';
       ctx.strokeStyle = '#82AAFF';
       if (rotate || move) {
         ctx.fillStyle = '#4287f530';
         ctx.strokeStyle = '#4287f5';
       }
       ctx.lineWidth = 3;
       ctx.beginPath();
       ctx.moveTo(dots.left.posX * 0.33 + this.viewport.x + this.imgSize/2 - 13, dots.top.posY * -0.33 + this.viewport.y + this.imgSize/2 - 13);
       ctx.lineTo(dots.left.posX * 0.33 + this.viewport.x + this.imgSize/2 - 13, dots.bottom.posY * -0.33 + this.viewport.y + this.imgSize/2 + 13);
       ctx.lineTo(dots.right.posX * 0.33 + this.viewport.x + this.imgSize/2 + 13, dots.bottom.posY * -0.33 + this.viewport.y + this.imgSize/2 + 13);
       ctx.lineTo(dots.right.posX * 0.33 + this.viewport.x + this.imgSize/2 + 13, dots.top.posY * -0.33 + this.viewport.y + this.imgSize/2 - 13);
       ctx.arc(dots.left.posX * 0.33 + this.viewport.x + this.imgSize/2 - 13, dots.top.posY * -0.33 + this.viewport.y + this.imgSize/2 - 13, 3, 0, 2 * Math.PI, false);
       ctx.closePath();
       ctx.fill();
       ctx.stroke();
       if (rotate || move) {
         ctx.strokeStyle = '#303030';
         ctx.fillStyle = '#ffffff';
         ctx.lineWidth = 2;
         let center = getRectCenter();
         ctx.beginPath();
         ctx.arc(center.x , center.y , 3, 0, 2 * Math.PI, false);
         ctx.closePath();
         ctx.fill();
         ctx.stroke();
       }
       if (rotate) {
         ctx.fillText(`Rotate`, dots.left.posX * 0.33 + this.viewport.x + this.imgSize/2 - 13, dots.top.posY * -0.33 + this.viewport.y + this.imgSize/2 - 20)
       }
     }
     this.canvas.nativeElement.addEventListener('mouseenter', function () {
       this.style.cursor = '-webkit-grab';
     });
     this.canvas.nativeElement.addEventListener('mouseleave', function () {
       this.style.cursor = 'pointer';
     });
    this.canvas.nativeElement.addEventListener('mousedown', (event) => {
      this.canvas.nativeElement.style.cursor = '-webkit-grabbing';
       dragStart = {
         x: event.pageX - this.canvas.nativeElement.offsetLeft,
         y: event.pageY - this.canvas.nativeElement.offsetTop
       }
     drag = true;
     if (this.dots) {
       if (isOnRect(event.offsetX, event.offsetY, {x: this.dots.left.posX * 0.33 + this.viewport.x + this.imgSize/2 - 23, y: this.dots.top.posY * -0.33 + this.viewport.y + this.imgSize/2 - 23, radius: 10})) {
         // rotate = true;
         drag = false;
         // console.log(this.dots);
         move = true;
       }
     }
    })
    this.canvas.nativeElement.addEventListener('mouseup', function () {
     drag = false;
     move = false;
     rotate = false;
     this.style.cursor = '-webkit-grab';
    })
    this.canvas.nativeElement.addEventListener('mousemove', (event) => {
      dragEnd = {
        x: event.pageX - this.canvas.nativeElement.offsetLeft,
        y: event.pageY - this.canvas.nativeElement.offsetTop
      }
      if (drag && !move) {
        this.viewport.x = this.viewport.x - (dragStart.x - dragEnd.x);
        this.viewport.y = this.viewport.y - (dragStart.y - dragEnd.y);
        dragStart = dragEnd;
      }
      if (move) {
        moveObjects(-(dragStart.x - dragEnd.x)/0.33, (dragStart.y - dragEnd.y)/0.33);
        dragStart = dragEnd;
        origin = getRectCenter();
      }
      if (rotate) {
        if (!origin) {
           origin = getRectCenter();
        }
        // console.log(getRelativeRotationDegree(event.offsetX, event.offsetY))
        rotateObjects(getRelativeRotationDegree(event.offsetX, event.offsetY));
        // console.log(this.dots);
      }
      // if (isOnRect(event.offsetX, event.offsetY, {x: this.dots.left.posX * 0.33 + this.viewport.x + this.imgSize/2 - 13, y: this.dots.top.posY * -0.33 + this.viewport.y + this.imgSize/2 - 13, radius: 10})) {
      //   this.canvas.nativeElement.style.cursor = 'move';
      //   console.log(true);
      // } else {
      //   this.canvas.nativeElement.style.cursor = '-webkit-grab';
      // };
    })
    const draw = () => {
      clear();
      ctx.drawImage(this.map, this.viewport.x, this.viewport.y, this.viewport.dx, this.viewport.dy);
      drawDots();
      if (this.mode == 'move') {
        drawRect(jarvis(this._objects));
      }
      window.requestAnimationFrame(draw);
    }
  }

  ngOnInit(): void {
    this.canvas.nativeElement.width = this.hostElem.nativeElement.offsetWidth;
    this.canvas.nativeElement.height = this.hostElem.nativeElement.offsetHeight;
    this.viewport = {
      x: (-this.imgSize/2+this.canvas.nativeElement.width/2)+(+this._objects[1].posX*-0.33),
      y: (-this.imgSize/2+this.canvas.nativeElement.height/2)+(+this._objects[1].posY*0.33),
      dx: this.imgSize,
      dy: this.imgSize
    }
    this.mapView();
  }

}
