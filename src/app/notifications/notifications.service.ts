import { Injectable } from '@angular/core';
import { WebSocketService } from '@lars/ws/web-socket.service';
import { Subscription, TeardownLogic} from 'rxjs';
import { filter } from 'rxjs/operators';
import { getProcessTranslation } from '@lars/shared/components/line-process/log-processes';

@Injectable()
export class NotificationsService {

  private _notifications: Subscription = new Subscription();
  
  constructor(
    private _ws: WebSocketService,
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
      this._ws.getAlertGuardBlockOn()
             .pipe(filter(() => !!JSON.parse(window.localStorage.getItem('alerts')).autoBlock))
             .subscribe((line) => {
                this.spawnNotification(`Кикбан ${line.nickname}`, `${line.nickname} заблокирован системой по причине ${line.content.message}`);
             }),
      this._ws.getAlertKickban()
             .pipe(filter(() => !!JSON.parse(window.localStorage.getItem('alerts')).autoBan))
             .subscribe((line) => {
               this.spawnNotification(`Кикбан ${line.nickname}`, `${line.nickname} кикнут системой по причине: ${getProcessTranslation(line.process)}`);
             }),
      this._ws.getServerStopNotification()
             .pipe(
                filter(() => !!JSON.parse(window.localStorage.getItem('alerts')).serverShutdown),
             ).subscribe((user: any) => {
                this.spawnNotification('Сервер остановлен', `${user.username} остановил работу сервера`, user.user_avatar);
             }),
      this._ws.getServerRebootNotification()
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
