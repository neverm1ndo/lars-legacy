import { Component, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../user.service';
import { ApiService } from '../api.service';
import { ToastService } from '../toast.service';
import { settings } from '../app.animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss'],
  animations: [settings]
})
export class AdminsComponent implements OnInit {

  admins: any[] = [];

  fa = {
    agent: faUserSecret
  }
  popup: boolean = false;

  addAdminForm: FormGroup = new FormGroup({
    nickname: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
    group: new FormControl(9, [
      Validators.required
    ])
  });;

  roles = [
    { id: 9, val: 'Претендент' },
    { id: 10, val: 'Разработчик' },
    { id: 12, val: 'Маппер' },
    { id: 11, val: 'Админ' },
    { id: 13, val: 'Редактор конфигов' },
    { id: 14, val: 'Бэкапер' }
  ]

  constructor(
    private idbService: NgxIndexedDBService,
    private api: ApiService,
    public userService: UserService,
    private toast: ToastService
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

  userLink(id: number) {
    this.userService.openUserProfile(id);
  }

  getFullAdminsList() {
    this.api.getAdminsList().subscribe((admins: any) => {
      console.log(admins);
      this.admins = admins;
    });
  }
  getFullAdminsAll() {
    this.api.getAdminsAll().subscribe((admins: any) => {
      this.admins = admins;
    });
  }
  getAdminSubGroup() {
    this.api.getAdminSubGroup().subscribe((admins: any) => {
      console.log(admins);
    });
  }

  addNewAdmin() {
      this.changeAdminGroup(this.addAdminForm.value.nickname, this.addAdminForm.value.group);
      this.popup = false;
      this.getFullAdminsList();
  }
  removeAdmin(username: string) {
    this.changeAdminGroup(username, 6);
    setTimeout(() => {
      this.getFullAdminsList();
    }, 500);
  }

  changeAdminGroup(username: string, group: number) {
    this.api.setAdminGroup(username, group).subscribe(() => {
      this.toast.show(`Админ <b>${ username }</b> перемещен в группу <b>${ this.userService.getUserGroupName(group)}</b>`,
        {
          classname: 'bg-success text-light',
          delay: 3000,
          icon: faUserSecret
        });
    });
  }

  ngOnInit(): void {
    // this.getAdmins();
    // this.getFullAdminsAll();
    this.getFullAdminsList();
    // this.getAdminSubGroup();
  }

}
