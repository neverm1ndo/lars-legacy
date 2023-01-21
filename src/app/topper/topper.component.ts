import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ElectronService } from '../core/services';
import { UserService } from '../user.service';
import { faSignOutAlt, faComments, faCloudDownloadAlt, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { WebSocketService } from '../web-socket.service';
import { Subject, Subscription } from 'rxjs';
import { extrudeToRight } from '../app.animations';

interface LarsWindow {
  close: () => void,
  min: () => void
}

@Component({
  selector: 'app-topper',
  templateUrl: './topper.component.html',
  styleUrls: ['./topper.component.scss'],
  animations: [extrudeToRight],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopperComponent implements OnInit {

  fa = {
    signout: faSignOutAlt,
    comm: faComments,
    update: faCloudDownloadAlt,
    gamepad: faGamepad
  };

  private _mainRoomSubscriptions: Subscription = new Subscription();
  public $update: Subject<boolean> = new Subject();

  public window: LarsWindow = {
    close: () => {
      if (this._userService.getUserSettings().tray) {
        this._electron.ipcRenderer.send('minimize-to-tray');
        return;
      }
      this._electron.ipcRenderer.send('close');
    },
    min: () => {
      this._electron.ipcRenderer.send('minimize');
    },
  };

  constructor(
    private _electron: ElectronService,
    private _userService: UserService,
    private _socket: WebSocketService,
  ) {}

  get isLoggedIn() {
    return this._userService.loggedInUser$;
  }

  public reload(): void {
    this._electron.ipcRenderer.send('reload');
  }

  public logout(): void {
    return this._userService.logoutUser();
  }

  public isElectron(): boolean {
    return this._electron.isElectron;
  }

  public openForum(): void {
    this._userService.openForum();
  }

  // private _subscribeToCommonSubscriptions(): void {
  //   this._mainRoomSubscriptions.add(
  //     this._socket.getUpdateMessage()
  //                 .subscribe(() => {
  //                     console.log('%c[update]', 'color: cyan', 'soft update is ready');
  //                     this.$update.next(true);
  //                   }));
  // }

  ngOnInit(): void {
  }

}
