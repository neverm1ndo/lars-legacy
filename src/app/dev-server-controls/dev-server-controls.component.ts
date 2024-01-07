import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faSignOutAlt, faTerminal, faComments, faPlay, faRedo, faStop, faCloudDownloadAlt, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { ElectronService } from '@lars/core/services';
import { WebSocketService } from '@lars/ws/web-socket.service';
import { ExecException } from 'child_process';
import { join } from 'path';
import { BehaviorSubject, Subscription, TeardownLogic } from 'rxjs';

enum ServerState {
  ERROR,
  STOPED,
  REBOOTING,
  LIVE,
  LOADING
}

interface IServerRemote {
  state: ServerState,
  reboot: () => void,
  launch: () => void,
  stop: () => void,
}

@Component({
  selector: 'dev-server-controls',
  templateUrl: './dev-server-controls.component.html',
  styleUrls: ['./dev-server-controls.component.scss']
})
export class DevServerControlsComponent implements OnInit {

  constructor(
    private _electron: ElectronService,
    private _zone: NgZone,
    private _socket: WebSocketService,
    private _router: Router,
  ) { }

  public state$: BehaviorSubject<ServerState> = new BehaviorSubject(ServerState.LOADING);

  private _devRoomSubscriptions: Subscription = new Subscription();

  public fa = {
    signout: faSignOutAlt,
    terminal: faTerminal,
    comm: faComments,
    play: faPlay,
    redo: faRedo,
    stop: faStop,
    update: faCloudDownloadAlt,
    gamepad: faGamepad
  };

  players: number = 0;

  public serverRemote: IServerRemote = {
    state: ServerState.LOADING,
    reboot: () => {
      console.log('\x1b[35m[server]\x1b[0m', 'Rebooting samp03svr...');
      this._socket.send('reboot-server');
    },
    launch: () => {
      console.log('\x1b[35m[server]\x1b[0m', 'Launching samp03svr...');
      this._socket.send('launch-server');
    },
    stop: () => {
      console.log('\x1b[35m[server]\x1b[0m', 'Killing samp03svr...');
      this._socket.send('stop-server');
    },
  };

  private _subscribeToDevSubscriptions(): void {
    const subscriptions: TeardownLogic[] = [
      this._socket.getServerState()
                  .subscribe((state: ServerState) => {
                    console.log('%c[server]', 'color: magenta', 'status:', state);
                    this.state$.next(state);
                  }),
      this._socket.getServerError()
                  .subscribe((stderr: string) => {
                    console.error('%c[server]', 'color: magenta', stderr);
                    this.state$.next(ServerState.ERROR);
                  }),
      this._socket.getServerReboot()
                  .subscribe(() => {
                      console.log('%c[server]', 'color: magenta', 'server rebooted');
                      this.state$.next(ServerState.LIVE);
                      this.players = 0;
                  }),
      this._socket.getServerStop()
                  .subscribe(() => {
                      console.log('%c[server]', 'color: magenta', 'server stoped');
                      this.state$.next(ServerState.STOPED);
                      this.players = 0;
                  }),
      this._socket.getServerLaunch()
                  .subscribe(() => {
                      console.log('%c[server]', 'color: magenta', 'server launched');
                      this.state$.next(ServerState.LIVE);
                  }),
      this._socket.getServerOnline()
                  .subscribe((players: number) => {
                      this.players = players;
                  }),
      this.state$.subscribe((state: ServerState) => {
                    this.serverRemote.state = state;
                  }),
    ];
    for (let subscription of subscriptions) {
      this._devRoomSubscriptions.add(subscription);
    };
  }

  public launchSAMP(): void {
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

  ngOnInit(): void {
    this._subscribeToDevSubscriptions();
    this._socket.send('get-status');
  }

  ngOnDestroy(): void {
    this._devRoomSubscriptions.unsubscribe();
    this.state$.complete();
  }

}
