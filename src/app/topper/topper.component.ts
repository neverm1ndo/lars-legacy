import { Component, OnInit, NgZone } from '@angular/core';
import { ElectronService } from '../core/services';
import { ExecException } from 'child_process';
import { join } from 'path';
import { UserService } from '../user.service';
import { faSignOutAlt, faTerminal, faComments, faRedo, faStop, faPlay, faCloudDownloadAlt, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { WebSocketService } from '../web-socket.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { tap, switchMap, filter } from 'rxjs/operators';
import { extrudeToRight } from '../app.animations';
import { Router } from '@angular/router';

enum ServerState {
  ERROR,
  STOPED,
  REBOOTING,
  LIVE,
  LOADING
}

interface Server {
  state: ServerState,
  reboot: () => void,
  launch: () => void,
  stop: () => void,
}

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
    terminal: faTerminal,
    comm: faComments,
    play: faPlay,
    redo: faRedo,
    stop: faStop,
    update: faCloudDownloadAlt,
    gamepad: faGamepad
  };

  private _devRoomSubscriptions: Subscription = new Subscription();
  private _mainRoomSubscriptions: Subscription = new Subscription();
  state: BehaviorSubject<ServerState> = new BehaviorSubject(ServerState.LOADING);

  isLoggedIn: boolean = false;
  update: boolean = false;
  players: number = 0;

  server: Server = {
    state: ServerState.LOADING,
    reboot: () => {
      console.log('\x1b[35m[server]\x1b[0m', 'Rebooting samp03svr...');
      this.ws.send('reboot-server');
    },
    launch: () => {
      console.log('\x1b[35m[server]\x1b[0m', 'Launching samp03svr...');
      this.ws.send('launch-server');
    },
    stop: () => {
      console.log('\x1b[35m[server]\x1b[0m', 'Killing samp03svr...');
      this.ws.send('stop-server');
    },
  };

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

  launchSAMP(): void {
    try {
      const launchSettings = window.localStorage.getItem('launcher');
      if (!launchSettings) throw new Error('LAUNCHER_ERR: Empty launcher settings');
      const settings = JSON.parse(launchSettings);
      this._electron.childProcess.execFile(
        join(settings.samp, 'samp.exe'),
        [
          `-n ${settings.nickname}`,
          `-h ${settings.ip}`,
          `-p ${settings.port}`
        ],
        (err: ExecException, stdout: string) => {
          if (err) {
            this._zone.run(() => {
              this._router.navigate(['/home/settings/launcher']);
            });
            throw err;
          }
          if (stdout) console.log('%c[launcher]', 'color: brown', stdout);
          console.log('%c[launcher]', 'color: brown', 'Launched SAMP client');
        });
    } catch (err) {
      console.error(err);
      this._router.navigate(['/home/settings/launcher']);
    }
  }

  openForum(): void {
    this.userService.openForum();
  }

  subscribeToDevSubscriptions(): void {
    this._devRoomSubscriptions
      // .add(from(this.electron.ipcRenderer.invoke('server-game-mode', new URL(AppConfig.api.main).host, 7777)).subscribe((stat) => {
      //   this.state.next(stat?'live':'error');
      // }))
      .add(this.ws.getServerState().subscribe((state) => {
        console.log('%c[server]', 'color: magenta', 'status:', state);
        this.state.next(state);
      }))
      .add(this.ws.getServerError().subscribe((stderr: string) => {
        console.error('%c[server]', 'color: magenta', stderr);
        this.state.next(ServerState.ERROR);
      }))
      .add(this.ws.getServerReboot()
      .subscribe(() => {
         console.log('%c[server]', 'color: magenta', 'server rebooted');
         this.state.next(ServerState.LIVE);
      }))
      .add(this.ws.getServerStop().subscribe(() => {
         console.log('%c[server]', 'color: magenta', 'server stoped');
         this.state.next(ServerState.STOPED);
         this.players = 0;
      }))
      .add(this.ws.getServerLaunch().subscribe(() => {
        console.log('%c[server]', 'color: magenta', 'server launched');
        this.state.next(ServerState.LIVE);
      }))
      .add(this.ws.getServerOnline().subscribe((players: number) => {
        this.players = players;
      }))
      .add(this.state.subscribe((state: ServerState) => {
        this.server.state = state;
      }));
  }

  subscribeToCommonSubscriptions(): void {
    this._mainRoomSubscriptions.add(this.ws.getUpdateMessage().subscribe(() => {
      console.log('%c[update]', 'color: cyan', 'soft update is ready');
      this.update = true;
    }));
  }

  ngOnInit(): void {
    this.ws.onDisconnect().subscribe(() => {
      this._devRoomSubscriptions.unsubscribe();
      this._mainRoomSubscriptions.unsubscribe();
    });
    this.ws.onСonnect().subscribe(() => {
      this.userService.user.next(this.userService.getUserInfo());
    });

    /**
    * Check user
    * Subscribe to necessary events
    */
    this.userService.user
        .pipe(tap((user) => {
          if (user) return user;
          this._devRoomSubscriptions.unsubscribe();
          this._mainRoomSubscriptions.unsubscribe();
        }))
        .pipe(filter((user) => !!user))
        .pipe(switchMap(() => this.ws.getRoomName()))
        .subscribe((room: string) => {
          if (room.includes('devs')) {
            this.subscribeToDevSubscriptions();
            console.log('%c[socket-service]', 'color: tomato', 'Connected to private devs room');
            this.ws.send('get-status');
          }
          this.subscribeToCommonSubscriptions();
        });
  }

}
