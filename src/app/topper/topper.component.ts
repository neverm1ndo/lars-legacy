import { Component, OnInit, NgZone } from '@angular/core';
import { ElectronService } from '../core/services';
import { UserService } from '../user.service';
import { faSignOutAlt, faTerminal, faComments, faRedo, faStop, faPlay, faCloudDownloadAlt, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { WebSocketService } from '../web-socket.service';
import { BehaviorSubject, Subscription, TeardownLogic } from 'rxjs';
import { tap, switchMap, filter } from 'rxjs/operators';
import { extrudeToRight } from '../app.animations';
import { Router } from '@angular/router';

interface LarsWindow {
  close: () => void,
  min: () => void
}

@Component({
  selector: 'app-topper',
  templateUrl: './topper.component.html',
  styleUrls: ['./topper.component.scss'],
  animations: [extrudeToRight]
})
export class TopperComponent implements OnInit {

  fa = {
    signout: faSignOutAlt,
    // terminal: faTerminal,
    comm: faComments,
    // play: faPlay,
    // redo: faRedo,
    // stop: faStop,
    update: faCloudDownloadAlt,
    gamepad: faGamepad
  };

  private _devRoomSubscriptions: Subscription = new Subscription();
  private _mainRoomSubscriptions: Subscription = new Subscription();


  isLoggedIn: boolean = false;
  update: boolean = false;

  window: LarsWindow = {
    close: () => {
      if (this.userService.getUserSettings().tray) {
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
    public userService: UserService,
    public ws: WebSocketService,
    private _router: Router,
    private _zone: NgZone
  ) {}

  reload(): void {
    this._electron.ipcRenderer.send('reload');
  }

  isElectron(): boolean {
    return this._electron.isElectron;
  }

  openForum(): void {
    this.userService.openForum();
  }

  private _subscribeToCommonSubscriptions(): void {
    this._mainRoomSubscriptions.add(
      this.ws.getUpdateMessage()
             .subscribe(() => {
                console.log('%c[update]', 'color: cyan', 'soft update is ready');
                this.update = true;
              }));
  }
  /**
    * Check user
    * Subscribe to necessary events
  */
  // private _checkUser(): void {
  //   this.userService.loggedInUser$
  //   .pipe(
  //     tap((user) => {
  //       if (user) return user;
  //       this._devRoomSubscriptions.unsubscribe();
  //       this._mainRoomSubscriptions.unsubscribe();
  //     }),
  //     filter((user) => !!user),
  //     switchMap(() => this.ws.getRoomName())
  //   )
  //   .subscribe((room: string) => {
  //     if (room.includes('devs')) {
  //       this._subscribeToDevSubscriptions();
  //       console.log('%c[socket-service]', 'color: tomato', 'Connected to private devs room');
  //       this.ws.send('get-status');
  //     }
  //     this._subscribeToCommonSubscriptions();
  //   });
  // }

  ngOnInit(): void {
    this.ws.onDisconnect()
           .subscribe(() => {
              this._devRoomSubscriptions.unsubscribe();
              this._mainRoomSubscriptions.unsubscribe();
            });
    this.ws.onСonnect()
           .subscribe(() => {
              this.userService.loggedInUser$.next(this.userService.getCurrentUserInfo());
            });
    // this._checkUser();
  }

}
