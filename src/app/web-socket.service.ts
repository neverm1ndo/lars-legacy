import { Injectable } from '@angular/core';
import { WsMessage } from './interfaces/app.interfaces';
import { AppConfig } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private ws: WebSocket;
  state: BehaviorSubject<'stoped' | 'rebooting' | 'live' | 'error' | 'loading'> = new BehaviorSubject('live');
  constructor() {}

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
  disconnect() {
    this.ws.close();
  }
  send(msg: WsMessage): void {
    this.ws.send(JSON.stringify(msg));
  }
}
