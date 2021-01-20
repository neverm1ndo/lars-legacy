import { Component, OnInit, ElementRef, ViewChild, HostListener, Input } from '@angular/core';

interface Viewport {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

@Component({
  selector: 'map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.scss']
})
export class MapEditorComponent implements OnInit {

  _objects: any[];
  @Input('objects') set objects (newObjects: any[]) {
    this._objects = newObjects;
    if (this.canvas.nativeElement) {
      this.viewportTo(this._objects[1].posX, this._objects[1].posY);
    }
  }
  @ViewChild('map', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
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

  constructor(private hostElem: ElementRef) {}

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

  mapView(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    let drag: boolean = false;
    let dragStart: any;
    let dragEnd: any;
    if (!this.map) {
      this.map = new Image(this.imgSize, this.imgSize);
      this.map.src = './assets/images/sa_map4k.jpg';
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
         ctx.beginPath();
         ctx.arc(+obj.posX * 0.33 + this.viewport.x + this.imgSize/2, +obj.posY * -0.33 + this.viewport.y + this.imgSize/2, 10, 0, 2 * Math.PI, false);
         ctx.closePath();
         ctx.fill();
         ctx.stroke();
       });
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
    })
    this.canvas.nativeElement.addEventListener('mouseup', function () {
     drag = false;
     this.style.cursor = '-webkit-grab';
    })
    this.canvas.nativeElement.addEventListener('mousemove', (event) => {
      if (drag) {
        dragEnd = {
          x: event.pageX - this.canvas.nativeElement.offsetLeft,
          y: event.pageY - this.canvas.nativeElement.offsetTop
        }
        this.viewport.x = this.viewport.x - (dragStart.x - dragEnd.x);
        this.viewport.y = this.viewport.y - (dragStart.y - dragEnd.y);
        dragStart = dragEnd;
      }
    })
    const draw = () => {
      clear();
      ctx.drawImage(this.map, this.viewport.x, this.viewport.y, this.viewport.dx, this.viewport.dy);
      drawDots();
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
