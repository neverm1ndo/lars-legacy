import { Injectable } from '@angular/core';
import { WebSocketService } from '@lars/web-socket.service';
import { Subscription, TeardownLogic} from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { getProcessTranslation } from '@lars/shared/components/line-process/log-processes';

@Injectable({
  providedIn: 'any'
})
export class NotificationsService {

  private _notifications: Subscription = new Subscription();
  
  constructor(
    private ws: WebSocketService,
  ) {}

  spawnNotification(title: string, body: string, image?: string) {
    let options: NotificationOptions;
        options = {
          body: body,
          silent: !JSON.parse(window.localStorage.getItem('alerts')).silent, // Bad practice
          timestamp: Date.now(),
          lang: 'ru-RU',
          icon: image || 'lars://assets/icons/favicon.ico',
        };
    new Notification(title, options);
  }

  unsubFromNotifications() {
    this._notifications.unsubscribe();
  }

  subToNotifications() {
    const subscriptions: TeardownLogic[] = [
      this.ws.getAlertGuardBlockOn()
             .pipe(filter(() => !!JSON.parse(window.localStorage.getItem('alerts')).autoBlock))
             .subscribe((line) => {
                this.spawnNotification(`Кикбан ${line.nickname}`, `${line.nickname} заблокирован системой по причине ${line.content.message}`);
             }),
      this.ws.getAlertKickban()
             .pipe(filter(() => !!JSON.parse(window.localStorage.getItem('alerts')).autoBan))
             .subscribe((line) => {
               this.spawnNotification(`Кикбан ${line.nickname}`, `${line.nickname} кикнут системой по причине: ${getProcessTranslation(line.process)}`);
             }),
      this.ws.getServerStopNotification()
             .pipe(
                filter(() => !!JSON.parse(window.localStorage.getItem('alerts')).serverShutdown),
             ).subscribe((user: any) => {
                this.spawnNotification('Сервер остановлен', `${user.name} остановил работу сервера`, user.user_avatar);
             }),
      this.ws.getServerRebootNotification()
      .pipe(
          filter(() => !!JSON.parse(window.localStorage.getItem('alerts')).serverShutdown),
      ).subscribe((user: any) => {
        this.spawnNotification('Сервер перезапускается', `${user.username} запустил перезагрузку сервера`, user.user_avatar);
      }),
    ];
    for (const subscription of subscriptions) {
      this._notifications.add(subscription);
    }
  }
}
