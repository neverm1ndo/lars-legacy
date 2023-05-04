import { Injectable, Injector } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from './user.service';
import { filter, map, scan } from 'rxjs/operators';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { AppConfig } from '../environments/environment';
import { LogLine } from './interfaces/app.interfaces';
import { UserActivity } from './enums';

interface Auth {
  auth?: {
    token: string
  }
}
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;
interface AuthSocketIoConfig extends SocketIoConfig {
  options?: Merge<Auth, SocketIoConfig['options']>
}

const userToken: string = ((): string => {
  let user = localStorage.getItem('user');
  if (!user) return '';
  return JSON.parse(user).token;
})();

export const socketConfig: AuthSocketIoConfig = {
  url: AppConfig.api.socket,
  options: {
    auth: {
      token: userToken,
    },
    path: '/notifier/',
    autoConnect: false,
    extraHeaders: {
      'Authorization': `Bearer ${userToken}`,
    },
    withCredentials: true,
  },
};

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  protected alerts: Subscription = new Subscription();
  protected activies: Observable<any> = this.getUserActitvity()
  .pipe(
    scan((acc, curr) => Object.assign(acc, curr), {})
  );

  public $usersStates: Subject<{[name: string]: any}> = new Subject();
  
  constructor(
    private _router: Router,
    private _injector: Injector,
    private _socket: Socket
  ) {
    this._router.events.pipe(
      filter((val: any) => val instanceof NavigationEnd)
    ).subscribe((val: NavigationEnd) => {
        if(val.url){
          switch (val.url) {
            case '/home/dash': { _socket.emit('user-action', UserActivity.IDLE); break; }
            case '/home/search': { _socket.emit('user-action', UserActivity.IN_LOGS); break; }
            case '/home/configs': { _socket.emit('user-action', UserActivity.REDACT); break; }
            case '/home/maps': { _socket.emit('user-action', UserActivity.IN_MAPS); break; }
            case '/home/banhammer': { _socket.emit('user-action', UserActivity.IN_BANS); break; }
            case '/home/admins': { _socket.emit('user-action', UserActivity.IN_ADM); break };
            case '/home/backups': { _socket.emit('user-action', UserActivity.IN_BACKS); break };
            case '/home/stats': { _socket.emit('user-action', UserActivity.IN_STATS); break };
            case '/login': { this.disconnect(); break; }
            default: break;
          }
        }
      });
    _socket.on('connect', () => {
      console.log('%c[socket-service]', 'color: tomato', `Connected to Liberty-Admin-Node`);
    });
    _socket.on('disconnect', (reason: string) => {
      console.log('%c[socket-service]', 'color: tomato', 'Disconnected with reason: ' + reason);
    });
    this._injector.get(UserService).loggedInUser$.pipe(
      filter((user) => !!user)
    ).subscribe((user) => {
      this.connect();
    });
  }

  onDisconnect(): Observable<any> {
    return this._socket.fromEvent('disconnect');
  }

  onСonnect(): Observable<any> {
    return this._socket.fromEvent('disconnect');
  }

  getServerState(): Observable<any> {
    return this._socket.fromEvent('server-status');
  }
  getServerReboot(): Observable<any> {
    return this._socket.fromEvent('server-rebooted');
  }
  getServerStop(): Observable<any> {
    return this._socket.fromEvent('server-stoped');
  }
  getServerLaunch(): Observable<any> {
    return this._socket.fromEvent('server-launched');
  }
  getServerError(): Observable<string> {
    return this._socket.fromEvent('server-error');
  }

  getRoomName(): Observable<any> {
    return this._socket.fromEvent('room-name');
  }

  getUserActitvity(): Observable<any> {
    return this._socket.fromEvent('user-activity').pipe(
      map((data) => data)
    )
  }
  getNewLogLines(): Observable<any> {
    return this._socket.fromEvent('new-log-line');
  }

  getAlertGuardBlockOn(): Observable<LogLine> {
    return this._socket.fromEvent('alert:guard-block-on');
  }

  getAlertKickban(): Observable<LogLine> {
    return this._socket.fromEvent('alert:kickban');
  }
  getAlertReport(): Observable<LogLine> {
    return this._socket.fromEvent('alert:report');
  }
  getUpdateMessage(): Observable<LogLine> {
    return this._socket.fromEvent('update:soft');
  }
  getServerStopNotification(): Observable<any> {
    return this._socket.fromEvent('alert:server-stoped');
  }
  getServerRebootNotification(): Observable<any> {
    return this._socket.fromEvent('alert:server-rebooting');
  }
  getServerOnline(): Observable<number> {
    return this._socket.fromEvent('server-online');
  }
  clearUserData() {
    const user = this._injector.get(UserService).loggedInUser$;
          user.next(undefined);
    window.localStorage.removeItem('user');
  }
  disconnect() {
    if (this._socket) this._socket.disconnect();
  }
  connect() {
    this._socket.connect();
  }
  send(msg: string): void {
    this._socket.emit(msg);
  }
}
