import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Inject } from '@angular/core';
import { NotificationsService } from '../notifications/notifications.service';
import { WebSocketService } from '@lars/ws/web-socket.service';
import { IS_FRAME_WINDOW } from '@lars/app.module';
import { Observable } from 'rxjs';

@Component({
  selector: 'lars-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {

  isFrameWindow$: Observable<boolean>;

  constructor(
    private notifications: NotificationsService,
    private ws: WebSocketService,
    @Inject(IS_FRAME_WINDOW) _isFrameWindow: Observable<boolean>,
  ) {
    this.isFrameWindow$ = _isFrameWindow;
  }


  ngOnInit(): void {
    this.ws.connect();
    this.notifications.subToNotifications();
  }

  ngOnDestroy(): void {
    this.notifications.unsubFromNotifications();
    this.ws.disconnect();
  }
}
