import { Injectable } from '@angular/core';
import { WsMessage } from './interfaces/app.interfaces';
import { AppConfig } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private URL: string = AppConfig.api.ws + '?token=' + JSON.parse(localStorage.getItem('user')).token;
  private ws: WebSocket;
  constructor() {
  }

  connect(): void {
    this.ws = new WebSocket(this.URL);
    this.ws.onopen = () => {
      console.log('%c[ws-service]', 'color: tomato', 'WebService Connected to Liberty-Admin-Node');
    }
    this.ws.onmessage = (event: MessageEvent) => {
      const m: any = JSON.parse(event.data);
      switch (m.event) {
        case 'error': {
          console.error('%c[server]', 'color: magenta', m.msg);
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
       }
    }
  }
  send(msg: WsMessage): void {
    this.ws.send(JSON.stringify(msg));
  }
}
