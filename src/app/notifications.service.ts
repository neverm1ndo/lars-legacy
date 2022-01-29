import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { Subscription} from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { getProcessTranslation } from './line-process/log-processes';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  notifications: Subscription = new Subscription();
  constructor(
    private ws: WebSocketService,
    private idb: NgxIndexedDBService,
  ) {
  }

  spawnNotification(title: string, body: string, image?: string) {
    let options: NotificationOptions;
      options = {
        body: body,
        silent: !JSON.parse(localStorage.getItem('alerts')).silent,
        timestamp: Date.now(),
        lang: 'ru-RU',
        icon: image || 'lars://assets/icons/favicon.ico',
      }
    new Notification(title, options);
  }

  unsubFromNotifications() {
    this.notifications.unsubscribe();
  }

  subToNotifications() {
    this.notifications.add(
      this.ws.getAlertGuardBlockOn()
      .pipe(filter(() => !!JSON.parse(localStorage.getItem('alerts')).autoBlock))
      .subscribe((line) => {
        this.spawnNotification(`Кикбан ${line.nickname}`, `${line.nickname} заблокирован системой по причине ${line.content.message}`)
      }),
    )
    this.notifications.add(
      this.ws.getAlertKickban()
      .pipe(filter(() => !!JSON.parse(localStorage.getItem('alerts')).autoBan))
      .subscribe((line) => {
        this.spawnNotification(`Кикбан ${line.nickname}`, `${line.nickname} кикнут системой по причине: ${getProcessTranslation(line.process)}`)
      })
    )
    this.notifications.add(
      this.ws.getAlertReport()
      .pipe(filter(() => !!JSON.parse(localStorage.getItem('alerts')).playerReport))
      .subscribe((line) => {
        this.spawnNotification(`Жалоба ${line.nickname}`, `${line.content.message}`)
      })
    )
    this.notifications.add(
      this.ws.getServerStopNotification()
      .pipe(filter(() => !!JSON.parse(localStorage.getItem('alerts')).serverShutdown))
      .pipe(switchMap((user) => this.idb.getByIndex('user', 'name', user.username)))
      .subscribe((user: any) => {
        this.spawnNotification('Сервер остановлен', `${user.name} остановил работу сервера`, user.avatar)
      })
    )
    this.notifications.add(
      this.ws.getServerRebootNotification()
      .pipe(filter(() => !!JSON.parse(localStorage.getItem('alerts')).serverRestart))
      .pipe(switchMap((user) => this.idb.getByIndex('user', 'name', user.username)))
      .subscribe((user: any) => {
        this.spawnNotification('Сервер перезапускается', `${user.name} запустил перезагрузку сервера`, user.avatar);
      })
    )
  }
}
