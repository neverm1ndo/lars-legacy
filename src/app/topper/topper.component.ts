import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { UserService } from '../user.service';
import { faSignOutAlt, faTerminal, faComments } from '@fortawesome/free-solid-svg-icons';
import { AppConfig } from '../../environments/environment.dev';
@Component({
  selector: 'app-topper',
  templateUrl: './topper.component.html',
  styleUrls: ['./topper.component.scss']
})
export class TopperComponent implements OnInit {

  fa = {
    signout: faSignOutAlt,
    terminal: faTerminal,
    comm: faComments
  };

  isLoggedIn: boolean = false;
  authenticated: any;
  constructor(
    public electron: ElectronService,
    public userService: UserService
  ) {}

  winclose(): void {
    let win = this.electron.remote.getCurrentWindow();
        win.close();
  }
  winmin(): void {
    let win = this.electron.remote.getCurrentWindow();
        win.minimize();
  }

  openForum(): void {
    this.electron.shell.openExternal(AppConfig.links.forum);
  }

  ngOnInit(): void {
    this.userService.user.subscribe((user) =>{
      this.authenticated = user;
    });
    if (this.userService.isAuthenticated()) {
      this.userService.user.next(this.userService.getUserInfo());
    }
  }

}
