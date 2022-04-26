import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { ElectronService } from '../core/services';
import { ExecException } from 'child_process';
import { join } from 'path';
import { UserService } from '../user.service';
import { faSignOutAlt, faTerminal, faComments, faRedo, faStop, faPlay, faCloudDownloadAlt, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { AppConfig } from '../../environments/environment.dev';
import { WebSocketService } from '../web-socket.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { tap, switchMap, filter } from 'rxjs/operators';
import { extrudeToRight } from '../app.animations';
import { Router } from '@angular/router';

type ServerStateType = 'stoped' | 'rebooting' | 'live' | 'error' | 'loading';


@Component({
  selector: 'app-topper',
  templateUrl: './topper.component.html',
  styleUrls: ['./topper.component.scss'],
  animations: [extrudeToRight]
})
export class TopperComponent implements OnInit, AfterViewInit {

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

  devRoomSubscriptions: Subscription = new Subscription();
  mainRoomSubscriptions: Subscription = new Subscription();
  state: BehaviorSubject<ServerStateType> = new BehaviorSubject('live');

  isLoggedIn: boolean = false;
  update: boolean = false;
  players: number = 0;

  server = {
    state: 'loading',
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

  window = {
    close: () => {
      if (this.userService.getUserSettings().tray) {
        this.electron.ipcRenderer.send('minimize-to-tray');
        return;
      }
      this.electron.ipcRenderer.send('close');
    },
    min: () => {
      this.electron.ipcRenderer.send('minimize');
    },
  };

  constructor(
    public electron: ElectronService,
    public userService: UserService,
    public ws: WebSocketService,
    private router: Router,
    private zone: NgZone
  ) {}

  reload(): void {
    this.electron.ipcRenderer.send('reload');
  }

  launchSAMP(): void {
    try {
      const launchSettings = localStorage.getItem('launcher');
      if (!launchSettings) throw new Error('LAUNCHER_ERR: Empty launcher settings')
      const settings = JSON.parse(launchSettings);
      this.electron.childProcess.execFile(
        join(settings.samp, 'samp.exe'),
        [
          `-n ${settings.nickname}`,
          `-h ${settings.ip}`,
          `-p ${settings.port}`
        ],
        (err: ExecException, stdout: string) => {
          if (err) {
            this.zone.run(() => {
              this.router.navigate(['/home/settings/launcher']);
            });
            throw err;
          }
          if (stdout) console.log('%c[launcher]', 'color: brown', stdout);
          console.log('%c[launcher]', 'color: brown', 'Launched SAMP client')
        });
    } catch (err) {
      console.error(err);
      this.router.navigate(['/home/settings/launcher'])
    }
  }

  openForum(): void {
    this.electron.shell.openExternal(AppConfig.links.forum);
  }

  subscribeToDevSubscriptions(): void {
    this.devRoomSubscriptions
      // .add(from(this.electron.ipcRenderer.invoke('server-game-mode', new URL(AppConfig.api.main).host, 7777)).subscribe((stat) => {
      //   this.state.next(stat?'live':'error');
      // }))
      .add(this.ws.getServerState().subscribe((state) => {
        console.log('%c[server]', 'color: magenta', 'status:', state);
        this.state.next(state);
      }))
      .add(this.ws.getServerError().subscribe((stderr: string) => {
        console.error('%c[server]', 'color: magenta', stderr);
        this.state.next('error')
      }))
      .add(this.ws.getServerReboot()
        .pipe(switchMap(() => this.ws.getServerOnline()))
        .subscribe((players: number) => {
           console.log('%c[server]', 'color: magenta', 'server rebooted');
           this.state.next('live');
           this.players = players;
      }))
      .add(this.ws.getServerStop().subscribe(() => {
         console.log('%c[server]', 'color: magenta', 'server stoped');
         this.state.next('stoped');
         this.players = 0;
      }))
      .add(this.ws.getServerLaunch().subscribe(() => {
        console.log('%c[server]', 'color: magenta', 'server launched');
        this.state.next('live');
      }))
      .add(this.ws.getServerOnline().subscribe((players: number) => {
        this.players = players;
      }))
      .add(this.state.subscribe((state: ServerStateType) => {
        this.server.state = state;
      }));
  }

  subscribeToCommonSubscriptions(): void {
    this.mainRoomSubscriptions.add(this.ws.getUpdateMessage().subscribe(() => {
      console.log('%c[update]', 'color: cyan', 'soft update is ready');
      this.update = true;
    }));
  }


  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    /**
    * Check user
    * Subscribe to necessary events
    */
    this.userService.user
        .pipe(tap((user) => {
          if (user) return user;
          this.devRoomSubscriptions.unsubscribe();
          this.mainRoomSubscriptions.unsubscribe();
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
