import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationsService } from '../notifications/notifications.service';
import { WebSocketService } from '@lars/ws/web-socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    private notifications: NotificationsService,
    private ws: WebSocketService
  ) {}

  ngOnInit(): void {
    this.ws.connect();
    this.notifications.subToNotifications();
  }

  ngOnDestroy(): void {
    this.notifications.unsubFromNotifications();
    this.ws.disconnect();
  }
}
