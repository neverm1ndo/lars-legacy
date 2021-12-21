import { Injectable, Injector } from '@angular/core';
import { WsMessage } from './interfaces/app.interfaces';
import { AppConfig } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { ToastService } from './toast.service';
import { UserService } from './user.service';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { filter } from 'rxjs/operators';

//type UserActionType = 'redacting' | 'idle' | 'inlogs' | 'inmaps' | 'inadm';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private ws: WebSocket;
  usersStates = {};
  newLineCounter: number = 0;
  state: BehaviorSubject<'stoped' | 'rebooting' | 'live' | 'error' | 'loading'> = new BehaviorSubject('live');
  // activity: BehaviorSubject<UserActionType> = new BehaviorSubject('idle');
  constructor(
    private router: Router,
    private toast: ToastService,
    private injector: Injector
  ) {
    router.events.pipe(
      filter((val: any) => val instanceof NavigationEnd)
    ).subscribe((val: NavigationEnd) => {
        if(val.url){
          switch (val.url) {
            case '/home/dash': { this.send({event: 'user-action', msg: 'idle'}); break; }
            case '/home/search': { this.send({event: 'user-action', msg: 'inlogs'}); break; }
            case '/home/config-editor': { this.send({event: 'user-action', msg: 'redacting'}); break; }
            case '/home/maps': { this.send({event: 'user-action', msg: 'inmaps'}); break; }
            case '/home/admins': { this.send({event: 'user-action', msg: 'inadm'}); break };
            case '/login': { this.disconnect(); break; }
            default: break;
          }
        }
      });
  }

  connect(): void {
    const URL: string = AppConfig.api.ws + '?token=' + JSON.parse(localStorage.getItem('user')).token;
    this.ws = new WebSocket(URL);
    this.ws.onopen = () => {
      console.log('%c[ws-service]', 'color: tomato', 'WebService Connected to Liberty-Admin-Node');
      this.send({ event: 'get-status' });
    }
    this.ws.onmessage = (event: MessageEvent) => {
      const m: any = JSON.parse(event.data);
      switch (m.event) {
        case 'error': {
          console.error('%c[server]', 'color: magenta', m.msg);
          this.state.next('error');
          break;
        }
        case 'server-rebooted': {
          console.log('%c[server]', 'color: magenta', 'Server sucessfully rebooted');
          this.state.next('live');
          break;
        }
        case 'server-stoped': {
          console.log('%c[server]', 'color: magenta', 'Server sucessfully stoped');
          this.state.next('stoped');
          break;
        }
        case 'server-launched': {
          console.log('%c[server]', 'color: magenta', 'Server sucessfully launched');
          this.state.next('live');
          break;
        }
        case 'server-status': {
          console.log('%c[server]', 'color: magenta', 'status:', m.msg);
          this.state.next(m.msg);
          break;
        }
        case 'user-activity': {
          const msg = JSON.parse(m.msg);
          // console.log('%c[server]', 'color: magenta', 'activity:', msg);
          this.usersStates[msg.user] = msg.action;
          break;
        }
        case 'expire-token': {
          console.log('%c[ws-service]', 'color: tomato', m.msg);
          this.toast.show(`Ваша прошлая сессия была прекращена. Токен доступа сброшен.`,
            {
              classname: 'bg-warning text-dark',
              delay: 3000,
              icon: faUserSecret,
              subtext: 'Вашу прошлую сессию закрыл вышестоящий администратор.'
            });
          this.clearUserData();
          this.disconnect();
          this.router.navigate(['/login']);
          break;
        }
        case 'new-log-line': {
          this.newLineCounter++;
          break;
        }
        default: console.error('%c[ws-service]', 'color: tomato', 'Unknown message event')
          break;
      }
    }
    this.ws.onclose = (event: CloseEvent) => {
      if (event.wasClean) {
         console.log('%c[ws-service]', 'color: tomato', 'WS connection closed clearly');
       } else {
         console.error('%c[ws-service]','color: tomato', 'WS connection lost. CODE:', event.code,);
         console.log('%c[ws-service]', 'color: tomato', 'Trying to reconnect...');
         setTimeout(() => this.connect(), 5000);
         this.state.next('error')
       }
    }
  }
  userActionTranslation(action: string) {
    switch (action) {
      case 'idle': return 'Спит';
      case 'inlogs': return 'Просматривает логи';
      case 'inmaps': return 'В редакторе карт';
      case 'redacting': return 'В редакторе конфигов';
      case 'inadm': return 'В спискe админов';
      default: return '???';
    }
  }
  clearUserData() {
    const user = this.injector.get(UserService).user;
    user.next(undefined);
    localStorage.removeItem('user');
  }
  disconnect() {
    if (this.ws) this.ws.close();
  }
  send(msg: WsMessage): void {
    this.ws.send(JSON.stringify(msg));
  }
}
