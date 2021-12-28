import { Injectable, Injector } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
// import { ToastService } from './toast.service';
import { UserService } from './user.service';
// import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { filter, map, take } from 'rxjs/operators';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { AppConfig } from '../environments/environment';
import { LogLine } from './interfaces/app.interfaces';

interface Auth {
  auth?: {
    token: string
  }
}
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;
interface AuthSocketIoConfig extends SocketIoConfig {
  options?: Merge<Auth, SocketIoConfig['options']>
}
export const socketConfig: AuthSocketIoConfig = {
  url: AppConfig.api.socket,
  options: {
    auth: {
      token: JSON.parse(localStorage.getItem('user'))?JSON.parse(localStorage.getItem('user')).token:''
    },
    autoConnect: false
  }
};

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  protected alerts: Subscription = new Subscription();
  constructor(
    private router: Router,
    // private toast: ToastService,
    private injector: Injector,
    private socket: Socket
  ) {
    this.router.events.pipe(
      filter((val: any) => val instanceof NavigationEnd)
    ).subscribe((val: NavigationEnd) => {
        if(val.url){
          switch (val.url) {
            case '/home/dash': { socket.emit('user-action', 'idle'); break; }
            case '/home/search': { socket.emit('user-action', 'inlogs'); break; }
            case '/home/config-editor': { socket.emit('user-action', 'redacting'); break; }
            case '/home/maps': { socket.emit('user-action', 'inmaps'); break; }
            case '/home/admins': { socket.emit('user-action', 'inadm'); break };
            case '/login': { this.disconnect(); break; }
            default: break;
          }
        }
      });
    socket.on('connect', () => {
        console.log('%c[socket-service]', 'color: tomato', `Connected to Liberty-Admin-Node`);
        this.getRoomName().pipe(take(1)).subscribe((room) => {
          console.log(room)
          if (room.includes('devs')) {
            console.log('%c[socket-service]', 'color: tomato', 'Connected to private devs room');
            this.send('get-status');
            return;
          }
        })
        this.send('get-room');
    })
    socket.on('disconnect', (reason: string) => {
        console.log('%c[socket-service]', 'color: tomato', 'Disconnected with reason: ' + reason);
    })
    this.injector.get(UserService).user.pipe(
      filter((user) => !!user)
    ).subscribe((user) => {
      socketConfig.options.auth.token = user.token;
      this.connect();
    })
  }

  getServerState(): Observable<any> {
    return this.socket.fromEvent('server-status');
  }
  getServerReboot(): Observable<any> {
    return this.socket.fromEvent('server-rebooted');
  }
  getServerStop(): Observable<any> {
    return this.socket.fromEvent('server-stoped');
  }
  getServerLaunch(): Observable<any> {
    return this.socket.fromEvent('server-launched');
  }
  getServerError(): Observable<string> {
    return this.socket.fromEvent('server-error');
  }

  getRoomName(): Observable<'devs' | 'main'> {
    return this.socket.fromEvent('room-name');
  }

  getUserActitvity(): Observable<any> {
    return this.socket.fromEvent('user-activity').pipe(
      map((data) => data)
    )
  }
  getNewLogLines(): Observable<any> {
    return this.socket.fromEvent('new-log-line');
  }

  getAlertGuardBlockOn(): Observable<LogLine> {
    return this.socket.fromEvent('alert:guard-block-on');
  }

  getAlertKickban(): Observable<LogLine> {
    return this.socket.fromEvent('alert:kickban');
  }
    //     case 'expire-token': {
    //       console.log('%c[ws-service]', 'color: tomato', m.msg);
    //       this.toast.show(`Ваша прошлая сессия была прекращена. Токен доступа сброшен.`,
    //         {
    //           classname: 'bg-warning text-dark',
    //           delay: 3000,
    //           icon: faUserSecret,
    //           subtext: 'Вашу прошлую сессию закрыл вышестоящий администратор.'
    //         });
    //       this.clearUserData();
    //       this.disconnect();
    //       this.router.navigate(['/login']);
    //       break;
    //     }
  clearUserData() {
    const user = this.injector.get(UserService).user;
    user.next(undefined);
    localStorage.removeItem('user');
  }
  disconnect() {
    if (this.socket) this.socket.disconnect();
  }
  connect() {
    this.socket.connect();
  }
  send(msg: string): void {
    this.socket.emit(msg);
  }
}
