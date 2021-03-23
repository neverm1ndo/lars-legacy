import { Component, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../user.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {

  admins: any[] = [];

  fa = {
    agent: faUserSecret
  }

  constructor(
    private idbService: NgxIndexedDBService,
    private api: ApiService,
    public userService: UserService
  ) { }


  getAdmins() {
    this.idbService.getAll('user').subscribe((users) => {
      users.forEach((user) => {
        if ((user.group == 9) || (user.group == 10) || (user.group == 11) || (user.group == 12)) {
          this.admins.push(user);
        }
      })
    })
  }

  getFullAdminsList() {
    this.api.getAdminsList().subscribe((admins: any) => {
      console.log(admins);
      this.admins = admins;
    });
  }

  ngOnInit(): void {
    // this.getAdmins();
    this.getFullAdminsList();
  }

}
