import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ElectronService } from '../core/services';
import { UserService } from '../user/user.service';
import {
  faSignOutAlt,
  faComments,
  faCloudDownloadAlt,
  faGamepad
} from '@fortawesome/free-solid-svg-icons';
import { WebSocketService } from '../ws/web-socket.service';
import { Subject, Subscription, map, tap } from 'rxjs';
import { extrudeToRight } from '../app.animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

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

  href$: Subject<null | string> = new Subject();

  isFrameWindow$ = this.route.queryParams.pipe(map(({ frame }) => Boolean(frame)));

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
    private electron: ElectronService,
    private userService: UserService,
    private ws: WebSocketService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
    console.log(window);
    this.subscriptions.add(
      this.ws.getUpdateMessage().subscribe(() => {
        console.log('New update is ready!');
        this.$update.next(true);
      })
    );
    this.location.onUrlChange((a) => {
      console.log(a);
      this.href$.next(a);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
