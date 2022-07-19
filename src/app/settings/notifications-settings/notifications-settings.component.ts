import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'notifications-settings',
  templateUrl: './notifications-settings.component.html',
  styleUrls: ['./notifications-settings.component.scss']
})
export class NotificationsSettingsComponent implements OnInit {

  constructor(private idb: NgxIndexedDBService) {}

  settings = new FormGroup({
    silent: new FormControl(false),
    playerReport: new FormControl(true),
    autoBan: new FormControl(true),
    autoBlock: new FormControl(true),
    serverShutdown: new FormControl(true),
    serverRestart: new FormControl(true),
  });

  get sets() {
    return this.settings.value;
  }

  setup() {
    window.localStorage.setItem('alerts', JSON.stringify(this.sets));
  }

  getNotificationsSettingsFromStorage(): void {
    try {
      if (!window.localStorage.getItem('alerts')) throw new Error('EMPTY_NOTIFICATIONS_SETTINGS');
      this.settings.setValue(JSON.parse(window.localStorage.getItem('alerts')));
    } catch(err) {
      this.setup();
      console.warn(err.message, 'Notifications settings reset to default');
    }
  }

  testNotification(): void {
    this.idb.getByIndex('user', 'name', JSON.parse(localStorage.getItem('user')).username)
    .subscribe((user: any) => {
      new Notification('Это тестовое оповещение!', {
        body: 'Это оповещение вызвано кнопкой "Тест оповещений"',
        timestamp: Date.now(),
        lang: 'ru-RU',
        silent: !this.sets.silent,
        icon: user.avatar,
        requireInteraction: true,
        image: user.avatar
      });
    });
  }

  ngOnInit(): void {
    this.getNotificationsSettingsFromStorage();
  }

}