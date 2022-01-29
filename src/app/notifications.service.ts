import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { Subscription} from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  notifications: Subscription = new Subscription();
  constructor(
    private ws: WebSocketService,
  ) {
  }

  spawnNotification(title: string, body: string) {
    let options: NotificationOptions;
      options = {
        body: body,
        silent: !JSON.parse(localStorage.getItem('alerts')).silent,
        timestamp: Date.now(),
        lang: 'ru-RU',
        icon: 'lars://assets/icons/favicon.ico'
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
        this.spawnNotification(`Кикбан ${line.nickname}`, `${new Date(line.unix*1000).toDateString()} ${line.nickname} кикнут системой`)
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
      .subscribe((user) => {
        this.spawnNotification('Сервер остановлен', `${user.username} остановил работу сервера`)
      })
    )
    this.notifications.add(
      this.ws.getServerRebootNotification()
      .pipe(filter(() => !!JSON.parse(localStorage.getItem('alerts')).serverRestart))
      .subscribe((user) => {
        this.spawnNotification('Сервер перезапускается', `${user.username} запустил перезагрузку сервера`)
      })
    )
  }
}
