import { Component, OnInit } from '@angular/core';
import { faUserSecret, faPooStorm, faWind, faMap, faFileSignature, faSearch, faBoxOpen, faUserSlash, faChartPie, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '@lars/user.service';
import { ApiService } from '@lars/api.service';
import { ToastService } from '@lars/toast.service';
import { settings } from '@lars/app.animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ElectronService } from '@lars/core/services';
import { WebSocketService } from '@lars/web-socket.service';
import { Workgroup, UserActivity } from '@lars/enums';

interface AdminUser {
  user_id: number;
  user_email: string;
  user_avatar: string;
  username: string;
  main_group: Workgroup;
  secondary_group: Workgroup;
}

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss'],
  animations: [settings]
})
export class AdminsComponent implements OnInit {

  admins: AdminUser[] = [];

  fa = {
    agent: faUserSecret,
    poo: faPooStorm,
    search: faSearch,
    wind: faWind,
    map: faMap,
    conf: faFileSignature,
    box: faBoxOpen
  };
  popup: boolean = false;

  addAdminForm: FormGroup = new FormGroup({
    nickname: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
    mainGroup: new FormControl(Workgroup.Challenger, [
      Validators.required
    ]),
    secondaryGroup: new FormControl(Workgroup.Challenger)
  });

  roles = [
    { id: Workgroup.Challenger, val: 'Претендент' },
    { id: Workgroup.Dev, val: 'Разработчик' },
    { id: Workgroup.Admin, val: 'Админ' },
  ];
  subRoles = [
    { id: Workgroup.Challenger, val: 'Претендент' },
    { id: Workgroup.Dev, val: 'Разработчик' },
    { id: Workgroup.Mapper, val: 'Маппер' },
    { id: Workgroup.CFR, val: 'Редактор конфигов' },
    { id: Workgroup.Backuper, val: 'Бэкапер' }
  ];

  constructor(
    private _api: ApiService,
    private _userService: UserService,
    private _toast: ToastService,
    private _electron: ElectronService,
    private _ws: WebSocketService
  ) { }

  get userActivities() {
    return this._ws.usersStates;
  }

  get userInfo () {
    return this._userService.getCurrentUserInfo();
  }

  adminActivityIcon(state: number) {
    const icons = {
      [UserActivity.IDLE]: faWind,
      [UserActivity.IN_LOGS]: faSearch,
      [UserActivity.IN_MAPS]: faMap,
      [UserActivity.REDACT]: faFileSignature,
      [UserActivity.IN_BANS]: faUserSlash,
      [UserActivity.IN_ADM]: faUserSecret,
      [UserActivity.IN_BACKS]: faBoxOpen,
      [UserActivity.IN_STATS]: faChartPie
    };
    return icons[state];
  }

  userLink(id: number) {
    this._userService.openUserForumProfile(id);
  }

  getFullAdminsList() {
    this._api.getAdminsList().subscribe((admins: any) => {
      this.admins = admins;
    });
  }

  addNewAdmin() {
      // this.changeAdminGroup(this.addAdminForm.value.nickname, this.addAdminForm.value.group);
      this.popup = false;
      this.getFullAdminsList();
  }

  removeAdmin(username: string, id: number) {
    const dialogOpts = {
      type: 'question',
      buttons: ['Исключить', 'Отмена'],
      title: 'Подтверждение исключения',
      message: `Вы точно хотите исключть ${username} из администраторского состава?`
    };
    this._electron.ipcRenderer.invoke('message-box', dialogOpts).then((returnValue) => {
      if (returnValue.response !== 0) return;
      this.changeAdminGroup(username, id, 2);
      setTimeout(() => {
        this.getFullAdminsList();
      }, 500);
    });
  }

  /**
  * @deprecated
  */
  // closeAdminSession(username: string) {
  //   const dialogOpts = {
  //     type: 'question',
  //     buttons: ['Зарыть сессию', 'Отмена'],
  //     title: 'Подтверждение закрытия сессии',
  //     message: `Вы точно хотите закрыть сессию ${username}? Токен доступа пользователя ${username} к LARS будет сброшен.`
  //   };
  //   this._electron.ipcRenderer.invoke('message-box', dialogOpts).then((returnValue) => {
  //     if (returnValue.response !== 0) return;
  //     this._api.closeAdminSession(username).subscribe(() => {
  //       this._toast.show(`Закрыта сессия LARS пользователя <b>${ username }</b>. Токен доступа сброшен.`,
  //         {
  //           classname: 'bg-success text-light',
  //           delay: 3000,
  //           icon: faUserSecret
  //         });
  //     });
  //   }).catch(err => console.error(err));
  // }

  changeAdminGroup(username: string, id: number, group: number) {
    this._api.setAdminGroup(id, group)
             .subscribe({
                next: () => {
                  this._toast.show('success', `Админ <b>${ username }</b> перемещен в группу <b>${ this._userService.getUserGroupName(group)}</b>`, null, faUserSecret);
                },
                error: (err) => {
                  this._toast.show('danger', `Админ <b>${ username }</b> не был перемещен в группу <b>${ this._userService.getUserGroupName(group)}</b>`, err, faExclamationCircle);
                }
             });
  }

  changeSecondaryAdminGroup(username: string, id: number, group: number) {
    this._api.setAdminSecondaryGroup(id, group)
             .subscribe({
                next: () => {
                  this._toast.show('success', `Админ <b>${ username }</b> перемещен в группу <b>${ this._userService.getUserGroupName(group)}</b>`, null, faUserSecret);
                },
                error: (err) => {
                  this._toast.show('danger', `Админ <b>${ username }</b> не был перемещен в группу <b>${ this._userService.getUserGroupName(group)}</b>`, err, faUserSecret)
                }
            });
  }

  ngOnInit(): void {
    this.getFullAdminsList();
  }

}
