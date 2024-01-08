import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ElectronService } from '../core/services';
import { UserService } from '../user/user.service';
import { faSignOutAlt, faComments, faCloudDownloadAlt, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { WebSocketService } from '../ws/web-socket.service';
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
export class TopperComponent implements OnInit, OnDestroy {

  fa = {
    signout: faSignOutAlt,
    comm: faComments,
    update: faCloudDownloadAlt,
    gamepad: faGamepad
  };

  public $update: Subject<null | true> = new Subject();

  private subscriptions: Subscription = new Subscription();

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
    private _ws: WebSocketService
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

  ngOnInit(): void {
    this.subscriptions.add(
      this._ws.getUpdateMessage().subscribe(() => { console.log('New update is ready!'); this.$update.next(true); })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
