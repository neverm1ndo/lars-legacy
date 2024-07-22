import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, Inject } from '@angular/core';
import { ElectronService } from '../core/services';
import { UserService } from '../user/user.service';
import {
  faSignOutAlt,
  faComments,
  faCloudDownloadAlt,
  faGamepad
} from '@fortawesome/free-solid-svg-icons';
import { WebSocketService } from '../ws/web-socket.service';
import { Subject, Subscription } from 'rxjs';
import { extrudeToRight } from '../app.animations';
import { IS_FRAME_WINDOW } from '@lars/app.module';

interface LarsWindow {
  close: () => void;
  min: () => void;
}

@Component({
  selector: 'lars-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  animations: [extrudeToRight],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent implements OnInit, OnDestroy {
  fa = {
    signout: faSignOutAlt,
    comm: faComments,
    update: faCloudDownloadAlt,
    gamepad: faGamepad
  };

  public $update: Subject<null | true> = new Subject();

  private subscriptions: Subscription = new Subscription();

  public larsWindow: LarsWindow = {
    close: () => {
      if (window.name === 'monitor') {
        window.close();
        return;
      }

      if (this.userService.getUserSettings().tray) {
        this.electron.ipcRenderer.send('minimize-to-tray');
        return;
      }
      this.electron.ipcRenderer.send('close');
    },
    min: () => {
      this.electron.ipcRenderer.send('minimize');
    }
  };

  constructor(
    @Inject(IS_FRAME_WINDOW) private isFrameWindow: boolean,
    private electron: ElectronService,
    private userService: UserService,
    private ws: WebSocketService
  ) {}

  get isFrame() {
    return this.isFrameWindow;
  }

  get isLoggedIn() {
    return this.userService.loggedInUser$;
  }

  get user() {
    return this.userService.getCurrentUserInfo();
  }

  public reload(): void {
    this.electron.ipcRenderer.send('reload');
  }

  public logout(): void {
    return this.userService.logoutUser();
  }

  public isElectron(): boolean {
    return this.electron.isElectron;
  }

  public openForum(): void {
    this.userService.openForum();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.ws.getUpdateMessage().subscribe(() => {
        console.log('New update is ready!');
        this.$update.next(true);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
