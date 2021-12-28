import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private notifications: NotificationsService) { }

  ngOnInit(): void {
    this.notifications.subToNotifications();
  }
  ngOnDestroy(): void {
    this.notifications.unsubFromNotifications();
  }

}
