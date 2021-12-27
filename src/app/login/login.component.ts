import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { WebSocketService } from '../web-socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ])
  });;
  return: string = '';
  error: any;
  loading: boolean = false;
  ctx: CanvasRenderingContext2D;

  @ViewChild('bg', { static: true }) canvas: ElementRef<HTMLCanvasElement>;


  constructor(
    private userService: UserService,
    private router: Router,
    private ws: WebSocketService
  ) {
  }

  get email() { return this.loginForm.get('email') };
  get password() { return this.loginForm.get('password') };

  logIn() {
    this.loading = true;
    localStorage.setItem('lastUser', this.email.value);
    this.userService.loginUser(this.loginForm.value).subscribe(
      response => {
          this.loading = false;
          this.error = undefined;
          this.userService.user.next(response);
          this.router.navigate(['/home']);
          this.ws.connect();
        },
      error => {
        this.loading = false;
        this.error = error;
        console.error(error)
      });
  }

  animate(): void {
    let ctx = this.canvas.nativeElement.getContext('2d');
    let innerH = window.innerHeight;
    let fxH = 0;

    function sineEaseInOut(currentProgress: number, start: number, distance: number, steps: number) {
      return -distance/2 * (Math.cos(Math.PI*currentProgress/steps) - 1) + start;
    };

    function layer1() {
      ctx.fillStyle = '#30333e';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, innerH);
      ctx.lineTo(sineEaseInOut(innerH + fxH, 0, 500, 800), innerH);
      ctx.bezierCurveTo(sineEaseInOut(fxH, 0, 100, 1000), 200,  sineEaseInOut(fxH, 0, 300, 1000), 60, 50, 0);
      ctx.closePath();
      ctx.fill();
    }

    function layer3() { //blue
      ctx.fillStyle = '#356da9';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, innerH);
      ctx.lineTo(sineEaseInOut(innerH + fxH + 200, 0, 600, 1000), innerH);
      ctx.bezierCurveTo(sineEaseInOut(fxH, 0, 200, 900), 200,  sineEaseInOut(fxH, 0, 400, 1000), 60, 50, 0);
      ctx.closePath();
      ctx.fill();
    }

    function layer2() {
      ctx.fillStyle = '#8ab9ff';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, innerH);
      ctx.lineTo(sineEaseInOut(innerH + fxH + 100, 0, 600, 1000), innerH);
      ctx.bezierCurveTo(sineEaseInOut(fxH, 0, 300, 800), 200,  sineEaseInOut(fxH, 0, 500, 1000), 60, 50, 0);
      ctx.closePath();
      ctx.fill();
    }

    function draw() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      fxH++;
      layer2();
      layer3();
      layer1();
      window.requestAnimationFrame(draw);
    };
    draw();
  }

  ngOnInit(): void {
    this.ws.disconnect();
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
    this.animate();
    this.userService.error.subscribe((error) => {
      this.error = error.status + ' ' + error.message;
    });
    if (localStorage.getItem('lastUser')) {
      this.loginForm.setValue({
        email: localStorage.getItem('lastUser'),
        password: ''
      });
    }
    this.userService.getUserSettings();
  }
}
