import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services/electron/electron.service';

@Component({
  selector: 'app-topper',
  templateUrl: './topper.component.html',
  styleUrls: ['./topper.component.scss']
})
export class TopperComponent implements OnInit {

  isLoggedIn: boolean = false;
  constructor(
    public electron: ElectronService
  ) {
   }

  winclose(): void {
    let win = this.electron.remote.getCurrentWindow();
        win.close();
  }
  winmin(): void {
    let win = this.electron.remote.getCurrentWindow();
        win.minimize();
  }

  ngOnInit(): void {
  }

}
