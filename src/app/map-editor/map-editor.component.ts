import { Component, OnInit, ElementRef, ViewChild, HostListener, Input } from '@angular/core';

@Component({
  selector: 'map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.scss']
})
export class MapEditorComponent implements OnInit {

  @Input('objects') objects: any[];
  @ViewChild('map', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @HostListener('window:resize', ['$event']) onResize(event: Event) {
    this.canvas.nativeElement.width = this.hostElem.nativeElement.offsetWidth;
    this.canvas.nativeElement.height = this.hostElem.nativeElement.offsetHeight;
  }
  @HostListener('window:keyup', ['$event']) onKeyup(event: KeyboardEvent) {
    if (event.altKey) {
      switch (event.keyCode) {
        case 70 : { // Alt + F
          this.showFPS = this.showFPS?false:true;
          break;
        }
        default : break;
      }
    }
  }
  map: any;
  showFPS: boolean = false;

  constructor(private hostElem: ElementRef) {}

  mapView(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    var stop = false;
    var frameCount = 0;
    // var $results = $("#results");
    var fps, fpsInterval, startTime, now, then, elapsed;
    let drag: boolean = false;
    const imgSize = 2000;
    let viewport = {
      x: (-imgSize/2+this.canvas.nativeElement.width/2)+(+this.objects[1].posX*-0.33),
      y: (-imgSize/2+this.canvas.nativeElement.height/2)+(+this.objects[1].posY*0.33),
      dx: imgSize,
      dy: imgSize,
      zoom: 0
    }
    console.log(viewport);
    let mousePos: any;
    let dragStart: any;
    let dragEnd: any;
    let zooming: boolean = false;
    if (!this.map) {
      this.map = new Image(imgSize, imgSize);
      this.map.src = './assets/images/sa_map4k.jpg';
      this.map.onload = () => {
        draw();
      }
    } else {
      ctx.drawImage(this.map, 0, 0, imgSize, imgSize);
    }
    function sineEaseInOut(currentProgress, start, distance, steps) {
      return -distance/2 * (Math.cos(Math.PI*currentProgress/steps) - 1) + start;
    };
    const clear = () => {
       ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
     }
     // const zoom = (deltaWheel: number) => {
     //   console.log('123')
     //   viewport.zoom = viewport.zoom + deltaWheel;
     //   let progress: number = 0;
     //   let int = setInterval(() => {
     //     zooming = true;
     //     progress++;
     //     viewport.dx = sineEaseInOut(progress, viewport.dx, deltaWheel/2, 1);
     //     viewport.dy = sineEaseInOut(progress, viewport.dy, deltaWheel/2, 1);
     //     if (progress == Math.abs(deltaWheel)) {
     //       zooming = false;
     //       clearInterval(int);
     //     }
     //   }, 1);
     // }
     const drawDots = () => {
       this.objects.forEach((obj) => {
         ctx.fillStyle = '#d63b50';
         ctx.strokeStyle = '#fdfdfd';
         ctx.beginPath();
         ctx.arc(+obj.posX*0.33+viewport.x+imgSize/2, +obj.posY*-0.33+viewport.y+imgSize/2, 10, 0, 2 * Math.PI, false);
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
     this.canvas.nativeElement.addEventListener('wheel', (event) => {
       if (!zooming) {
         // zoom(event.deltaY);
       }
     });
    this.canvas.nativeElement.addEventListener('mousedown', (event) => {
       dragStart = {
         x: event.pageX - this.canvas.nativeElement.offsetLeft,
         y: event.pageY - this.canvas.nativeElement.offsetTop
       }
     drag = true;
    })
    this.canvas.nativeElement.addEventListener('mouseup', () => {
     drag = false;
     console.log(viewport);
    })
    this.canvas.nativeElement.addEventListener('mousemove', (event) => {
      mousePos = {
        x: event.x,
        y: event.y,
      }
      if (drag) {
        dragEnd = {
          x: event.pageX - this.canvas.nativeElement.offsetLeft,
          y: event.pageY - this.canvas.nativeElement.offsetTop
        }
        viewport.x = viewport.x - (dragStart.x - dragEnd.x);
        viewport.y = viewport.y - (dragStart.y - dragEnd.y);
        dragStart = dragEnd;
      }
    })
    const showFPS = () => {
      now = Date.now();
      elapsed = now - then;
      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
      }
      var sinceStart = now - startTime;
      var currentFps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100;
      ctx.font = "20px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(currentFps + " FPS", 10, 100);
    }
    const draw = () => {
      clear();
      ctx.drawImage(this.map, viewport.x, viewport.y, viewport.dx, viewport.dy);
      drawDots();
      if (this.showFPS ) { showFPS() };
      window.requestAnimationFrame(draw);
    }
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
  }

  ngOnInit(): void {
    this.canvas.nativeElement.width = this.hostElem.nativeElement.offsetWidth;
    this.canvas.nativeElement.height = this.hostElem.nativeElement.offsetHeight;
    this.mapView();
  }

}
