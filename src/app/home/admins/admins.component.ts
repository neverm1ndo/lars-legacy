import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { faUserSecret, faPooStorm, faWind, faMap, faFileSignature, faSearch, faBoxOpen, faUserSlash, faChartPie, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '@lars/user.service';
import { ApiService } from '@lars/api.service';
import { ToastService } from '@lars/toast.service';
import { settings } from '@lars/app.animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ElectronService } from '@lars/core/services';
import { WebSocketService } from '@lars/web-socket.service';
import { Workgroup, UserActivity } from '@lars/enums';
import { BehaviorSubject, Observable, filter, from, switchMap, take } from 'rxjs';
import { MessageBoxOptions, MessageBoxReturnValue } from 'electron';

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
  animations: [settings],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminsComponent implements OnInit {

  private $reloadAdminList: BehaviorSubject<null> = new BehaviorSubject(null);
  
  public $admins: Observable<AdminUser[]> = this.$reloadAdminList.pipe(
    switchMap(() => this.getFullAdminsList())
  );

  public fa = {
    agent: faUserSecret,
    poo: faPooStorm,
    search: faSearch,
    wind: faWind,
    map: faMap,
    conf: faFileSignature,
    box: faBoxOpen
  };
  
  popup: boolean = false;

  public addAdminForm: FormGroup = new FormGroup({
    nickname: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
    mainGroup: new FormControl(Workgroup.Challenger, [
      Validators.required
    ]),
    secondaryGroup: new FormControl(Workgroup.Challenger)
  });

  public roles = [
    { id: Workgroup.Challenger, val: 'Претендент' },
    { id: Workgroup.Dev, val: 'Разработчик' },
    { id: Workgroup.Admin, val: 'Админ' },
  ];
  
  public subRoles = [
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
    return this._ws.$usersStates;
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

  getFullAdminsList(): Observable<AdminUser[]> {
    return this._api.getAdminsList();
  }

  addNewAdmin() {
      this.popup = false;
      this.getFullAdminsList();
  }

  private _reloadList(): void {
    this.$reloadAdminList.next(null);
  }

  public removeAdmin(username: string, id: number) {
    const dialogOpts: MessageBoxOptions = {
      type: 'question',
      buttons: ['Исключить', 'Отмена'],
      title: 'Подтверждение исключения',
      message: `Вы точно хотите исключть ${username} из администраторского состава?`
    };
    from(this._electron.ipcRenderer.invoke('message-box', dialogOpts))
      .pipe(
        filter((value: MessageBoxReturnValue) => value.response !== 0),
        switchMap(() => this._api.setAdminGroup(id, 2)),
        take(1)
      ).subscribe({
        next: this._reloadList,
        error: console.error,
      });
  }

  public changeAdminGroup(username: string, id: number, group: number) {
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

  public changeSecondaryAdminGroup(username: string, id: number, group: number) {
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
  }

}
