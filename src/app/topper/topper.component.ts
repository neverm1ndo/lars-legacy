import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { ExecException } from 'child_process';
import { join } from 'path';
import { UserService } from '../user.service';
import { faSignOutAlt, faTerminal, faComments, faRedo, faStop, faPlay, faCloudDownloadAlt, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { AppConfig } from '../../environments/environment.dev';
import { WebSocketService } from '../web-socket.service';
import { BehaviorSubject } from 'rxjs';
import { extrudeToRight } from '../app.animations';

type ServerStateType = 'stoped' | 'rebooting' | 'live' | 'error' | 'loading';


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

  state: BehaviorSubject<ServerStateType> = new BehaviorSubject('live');
  isLoggedIn: boolean = false;
  authenticated: any;
  update: boolean = false;
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
    }
  }
  window = {
    win: this.electron.remote.getCurrentWindow(),
    close: () => {
      if (this.userService.getUserSettings().tray) {
        this.electron.ipcRenderer.send('minimize-to-tray');
        return;
      }
      this.window.win.close();
    },
    min: () => {
      this.window.win.minimize();
    }
  }
  constructor(
    public electron: ElectronService,
    public userService: UserService,
    public ws: WebSocketService
  ) {}

  reload() {
    this.window.win.reload();
  }
  launchSAMP(): void {
    const launchSettings = JSON.parse(localStorage.getItem('launcher'));
    const ip = '185.104.113.34';
    const port = 7777;
    this.electron.childProcess.execFile(
      join(launchSettings.samp, 'samp.exe'),
      [
        `-n ${launchSettings.nickname}`,
        `-h ${ip}`,
        `-p ${port}`
      ],
      (err: ExecException, stdout: string) => {
        if (err) return console.log(`Err`, err);
        console.log('%c[launcher]', 'color: brown', stdout)
      });
  }
  openForum(): void {
    this.electron.shell.openExternal(AppConfig.links.forum);
  }
  ngOnInit(): void {
    this.userService.user.subscribe((user) =>{
      this.authenticated = user;
      this.state.subscribe((val: any) => {
        this.server.state = val;
      })
    });
    if (this.userService.isAuthenticated()) {
      this.userService.user.next(this.userService.getUserInfo());
      this.ws.getServerState().subscribe((state) => {
        console.log('%c[server]', 'color: magenta', 'status:', state);
        this.state.next(state)
      })
      this.ws.getServerError().subscribe((stderr: string) => {
         console.error('%c[server]', 'color: magenta', stderr);
         this.state.next('error')
      });
      this.ws.getServerReboot().subscribe(() => {
         console.log('%c[server]', 'color: magenta', 'server rebooted');
         this.state.next('live')
      });
      this.ws.getServerStop().subscribe(() => {
         console.log('%c[server]', 'color: magenta', 'server stoped');
         this.state.next('stoped');
      });
      this.ws.getServerLaunch().subscribe(() => {
         console.log('%c[server]', 'color: magenta', 'server launched');
         this.state.next('live');
      });
      this.ws.getUpdateMessage().subscribe(() => {
         console.log('%c[update]', 'color: cyan', 'soft update is ready');
         this.update = true;
      });
      this.ws.getRoomName().subscribe((room) => {
        if (room.includes('devs')) {
          console.log('%c[socket-service]', 'color: tomato', 'Connected to private devs room');
          this.ws.send('get-status');
        }
      })
    }
  }

}
