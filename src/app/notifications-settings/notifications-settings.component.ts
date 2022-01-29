import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'notifications-settings',
  templateUrl: './notifications-settings.component.html',
  styleUrls: ['./notifications-settings.component.scss']
})
export class NotificationsSettingsComponent implements OnInit {

  constructor(private idb: NgxIndexedDBService) { }

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
    localStorage.setItem('alerts', JSON.stringify(this.sets));
  }

  getNotificationsSettingsFromStorage(): void {
    try {
      if (!localStorage.getItem('alerts')) throw new Error('EMPTY_NOTIFICATIONS_SETTINGS');
      this.settings.setValue(JSON.parse(localStorage.getItem('alerts')))
    } catch(err) {
      this.setup();
      console.warn(err.message, 'Notifications settings reset to default');
    }
  }

  testNotification(): void {
    // new Notification('Это тестовое оповещение!', {
    //   body: 'Это оповещение вызвано кнопкой "Тест оповещений"',
    //   timestamp: Date.now(),
    //   lang: 'ru-RU',
    //   silent: !this.sets.silent,
    //   icon: 'lars://assets/icons/favicon.ico',
    //   requireInteraction: true
    // });
    this.idb.getByIndex('user', 'name', JSON.parse(localStorage.getItem('user')).name)
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
    })
  }

  ngOnInit(): void {
    this.getNotificationsSettingsFromStorage();
  }

}
