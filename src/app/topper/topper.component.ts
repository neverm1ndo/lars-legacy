import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { UserService } from '../user.service';
import { faSignOutAlt, faTerminal, faComments, faRedo, faStop, faPlay, faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons';
import { AppConfig } from '../../environments/environment.dev';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-topper',
  templateUrl: './topper.component.html',
  styleUrls: ['./topper.component.scss']
})
export class TopperComponent implements OnInit {

  fa = {
    signout: faSignOutAlt,
    terminal: faTerminal,
    comm: faComments,
    play: faPlay,
    redo: faRedo,
    stop: faStop,
    update: faCloudDownloadAlt
  };


  isLoggedIn: boolean = false;
  authenticated: any;
  server = {
    state: 'loading',
    reboot: () => {
      console.log('\x1b[35m[server]\x1b[0m', 'Rebooting samp03svr...');
      this.ws.send({ event: 'reboot-server' });
    },
    launch: () => {
      console.log('\x1b[35m[server]\x1b[0m', 'Launching samp03svr...');
      this.ws.send({ event: 'launch-server' });
    },
    stop: () => {
      console.log('\x1b[35m[server]\x1b[0m', 'Killing samp03svr...');
      this.ws.send({ event: 'stop-server' });
    }
  }
  window = {
    win: this.electron.remote.getCurrentWindow(),
    close: () => {
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

  openForum(): void {
    this.electron.shell.openExternal(AppConfig.links.forum);
  }

  ngOnInit(): void {
    this.userService.user.subscribe((user) =>{
      this.authenticated = user;
      this.ws.connect();
      this.ws.state.subscribe((val: any) => {
        this.server.state = val;
      })
    });
    if (this.userService.isAuthenticated()) {
      this.userService.user.next(this.userService.getUserInfo());
    }
  }

}
