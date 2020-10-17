import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';
import { UserService } from '../user.service';
@Component({
  selector: 'app-topper',
  templateUrl: './topper.component.html',
  styleUrls: ['./topper.component.scss']
})
export class TopperComponent implements OnInit {

  isLoggedIn: boolean = false;
  authenticated: any;
  constructor(
    public electron: ElectronService,
    private userService: UserService
  ) {}

  winclose(): void {
    let win = this.electron.remote.getCurrentWindow();
        win.close();
  }
  winmin(): void {
    let win = this.electron.remote.getCurrentWindow();
        win.minimize();
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
