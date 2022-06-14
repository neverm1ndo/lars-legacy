import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService} from '../user.service';
import { UserData } from '../interfaces';
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
  });

  error: any;
  loading: boolean = false;

  @ViewChild('bg', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _ws: WebSocketService,
    private _zone: NgZone
  ) {}

  get email() { return this.loginForm.get('email') };
  get password() { return this.loginForm.get('password') };

  logIn() {
    this.loading = true;
    window.localStorage.setItem('lastUser', this.email.value);
    this._userService.loginUser(this.loginForm.value).subscribe(
      (response: UserData) => {
        this.loading = false;
        this.error = undefined;
        this._zone.runOutsideAngular(() => {
          this._userService.user.next(response);
          window.localStorage.setItem('user', JSON.stringify(response));
        });
        this._router.navigate(['/home']);
        this._ws.connect();
      },
      (error) => {
        this.loading = false;
        this.error = error;
        console.error(error);
      });
  }

  private _animate(): void {
    const ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    let innerH: number = window.innerHeight;
    let fxH: number = 0;
    const STEP: number = 3

    function sineEaseInOut(currentProgress: number, start: number, distance: number, steps: number) {
      return -distance/2 * (Math.cos(Math.PI*currentProgress/steps) - 1) + start;
    };

    function drawLayer(color: string, pos: Function) {
      ctx.fillStyle = color;
      const path = new Path2D();
      path.moveTo(0, 0);
      path.lineTo(0, innerH);
      pos(path);
      path.closePath();
      ctx.fill(path);
    }

    const FPS_LIMIT: number = 60;

    let then: number = Date.now();
    const interval: number = 1000 / FPS_LIMIT;
    let delta: number;

    function draw() {

      window.requestAnimationFrame(draw);

      const now = Date.now();
      delta = now - then;

      if (delta <= interval) return;

      then = now - (delta % interval);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      fxH += STEP;
      drawLayer(
        '#8ab9ff',
        (path: Path2D): void => {
          path.lineTo(sineEaseInOut(innerH + fxH + 100, 0, 600, 1000), innerH);
          path.bezierCurveTo(sineEaseInOut(fxH, 0, 300, 800), 200,  sineEaseInOut(fxH, 0, 500, 1000), 60, 50, 0);
        }
      );
      drawLayer(
        '#356da9',
        (path: Path2D): void => {
          path.lineTo(sineEaseInOut(innerH + fxH + 200, 0, 600, 1000), innerH);
          path.bezierCurveTo(sineEaseInOut(fxH, 0, 200, 900), 200,  sineEaseInOut(fxH, 0, 400, 1000), 60, 50, 0);
        }
      );
      drawLayer(
        '#30333e',
        (path: Path2D): void => {
          path.lineTo(sineEaseInOut(innerH + fxH, 0, 500, 800), innerH);
          path.bezierCurveTo(sineEaseInOut(fxH, 0, 100, 1000), 200,  sineEaseInOut(fxH, 0, 300, 1000), 60, 50, 0);
        }
      );
    };
    draw();
  }

  ngOnInit(): void {
    this._ws.disconnect();
    this._zone.runOutsideAngular(() => {
      this.canvas.nativeElement.width = window.innerWidth;
      this.canvas.nativeElement.height = window.innerHeight;
      this._animate();
    });
    this._userService.error.subscribe((error) => {
      this.error = error.status + ' ' + error.message;
    });
    if (window.localStorage.getItem('lastUser')) {
      this.loginForm.setValue({
        email: window.localStorage.getItem('lastUser'),
        password: ''
      });
    }
    this._userService.getUserSettings();
  }
}
