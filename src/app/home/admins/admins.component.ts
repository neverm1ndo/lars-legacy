/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectionStrategy, Component, OnInit, TemplateRef } from '@angular/core';
import {
  faUserSecret,
  faPooStorm,
  faWind,
  faMap,
  faFileSignature,
  faSearch,
  faBoxOpen,
  faUserSlash,
  faChartPie,
  faExclamationCircle,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { UserService } from '@lars/user/user.service';
import { ApiService } from '@lars/api/api.service';
import { ToastService } from '@lars/toast.service';
import { settings } from '@lars/app.animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ElectronService } from '@lars/core/services';
import { WebSocketService } from '@lars/ws/web-socket.service';
import { Workgroup, UserActivity } from '@lars/enums';
import {
  BehaviorSubject,
  Observable,
  catchError,
  from,
  iif,
  map,
  of,
  switchMap,
  take,
  throwError
} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { handleError } from '@lars/utils';

interface AdminUser {
  user_id: number;
  user_email: string;
  user_avatar: string;
  username: string;
  main_group: Workgroup;
  secondary_group: Workgroup;
  permissions: Workgroup[];
}

@Component({
  selector: 'lars-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss'],
  animations: [settings],
  changeDetection: ChangeDetectionStrategy.OnPush
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
    box: faBoxOpen,
    faPlus
  };

  public addAdminForm: FormGroup = new FormGroup({
    nickname: new FormControl('', [Validators.required, Validators.minLength(1)]),
    mainGroup: new FormControl(Workgroup.Challenger, [Validators.required]),
    secondaryGroups: new FormControl([])
  });

  // TODO: Тянуть переводы названия групп из файла локализации
  public roles = [
    { id: Workgroup.Challenger, val: 'Претендент' },
    { id: Workgroup.Dev, val: 'Разработчик' },
    { id: Workgroup.Admin, val: 'Админ' }
  ];

  public subRoles = [
    { id: Workgroup.Mapper, val: 'Маппер' },
    { id: Workgroup.CFR, val: 'Редактор конфигов' },
    { id: Workgroup.Backuper, val: 'Бэкапер' }
  ];

  constructor(
    private api: ApiService,
    private userService: UserService,
    private toast: ToastService,
    private electron: ElectronService,
    private ws: WebSocketService,
    private modal: NgbModal,
    private translate: TranslateService
  ) {}

  get userActivities() {
    return this.ws.$usersStates;
  }

  get userInfo() {
    return this.userService.getCurrentUserInfo();
  }

  public open(content: TemplateRef<any>): void {
    this.modal.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', centered: true });
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
    this.userService.openUserForumProfile(id);
  }

  getFullAdminsList(): Observable<AdminUser[]> {
    return this.api.getAdminsList();
  }

  addNewAdmin() {
    this.getFullAdminsList();
  }

  private reloadList(): void {
    this.$reloadAdminList.next(null);
  }

  addAdminSecondaryGroup(id: number, group: Workgroup) {
    this.api
      .addAdminSecondaryGroup(id, group)
      .pipe(
        take(1),
        catchError((err) => handleError(err))
      )
      .subscribe({
        next: () => {
          this.toast.show(
            'success',
            this.translate.instant('Admins.Toast.ChangeAdminsGroup.Success', {
              username: id,
              group: this.userService.getUserGroupName(group)
            }),
            null,
            faUserSecret
          );
          this.$reloadAdminList.next(null);
        },
        error: (err) => {
          this.toast.show(
            'danger',
            this.translate.instant('Admins.Toast.ChangeAdminsGroup.Error', {
              username: id,
              group: this.userService.getUserGroupName(group)
            }),
            err,
            faExclamationCircle
          );
        }
      });
  }

  deleteAdminSecondaryGroup(id: number, group: Workgroup) {
    this.api
      .deleteAdminSecondaryGroup(id, group)
      .pipe(
        take(1),
        catchError((err) => of(err))
      )
      .subscribe({
        next: () => {
          this.toast.show(
            'success',
            this.translate.instant('Admins.Toast.ChangeAdminsGroup.Success', {
              username: id,
              group: this.userService.getUserGroupName(group)
            }),
            null,
            faUserSecret
          );
          this.$reloadAdminList.next(null);
        },
        error: (err) => {
          this.toast.show(
            'danger',
            this.translate.instant('Admins.Toast.ChangeAdminsGroup.Error', {
              username: id,
              group: this.userService.getUserGroupName(group)
            }),
            err,
            faExclamationCircle
          );
        }
      });
  }

  public removeAdmin(username: string, id: number) {
    this.translate
      .get(
        [
          'Admins.Dialog.RemoveAdmin.Confirm',
          'Admins.Dialog.RemoveAdmin.Cancel',
          'Admins.Dialog.RemoveAdmin.Title',
          'Admins.Dialog.RemoveAdmin.Message'
        ],
        { username }
      )
      .pipe(
        map((translations) => Object.values(translations)),
        map(([confirm, cancel, title, message]: string[]) => ({
          type: 'question',
          buttons: [cancel, confirm],
          title,
          message
        })),
        switchMap((options: Electron.MessageBoxOptions) =>
          from(this.electron.ipcRenderer.invoke('message-box', options))
        ),
        switchMap((val) =>
          iif(
            () => val.response === 1,
            this.api.setAdminGroup(id, 2),
            this.translate
              .get('Admins.Dialog.ClientResponseRejectError')
              .pipe(switchMap((error) => throwError(() => new Error(error))))
          )
        ),
        take(1)
      )
      .subscribe({
        next: this.reloadList,
        error: console.error
      });
  }

  public changeAdminGroup(username: string, id: number, group: number) {
    this.api.setAdminGroup(id, group).subscribe({
      next: () => {
        this.toast.show(
          'success',
          this.translate.instant('Admins.Toast.ChangeAdminsGroup.Success', {
            username,
            group: this.userService.getUserGroupName(group)
          }),
          null,
          faUserSecret
        );
      },
      error: (err) => {
        this.toast.show(
          'danger',
          this.translate.instant('Admins.Toast.ChangeAdminsGroup.Error', {
            username,
            group: this.userService.getUserGroupName(group)
          }),
          err,
          faExclamationCircle
        );
      }
    });
  }

  public changeSecondaryAdminGroup(username: string, id: number, group: number) {
    this.api.setAdminSecondaryGroup(id, group).subscribe({
      next: () => {
        this.toast.show(
          'success',
          this.translate.instant('Admins.Toast.ChangeAdminsGroup.Success', {
            username,
            group: this.userService.getUserGroupName(group)
          }),
          null,
          faUserSecret
        );
      },
      error: (err) => {
        this.toast.show(
          'success',
          this.translate.instant('Admins.Toast.ChangeAdminsGroup.Error', {
            username,
            group: this.userService.getUserGroupName(group)
          }),
          err,
          faUserSecret
        );
      }
    });
  }

  ngOnInit(): void {}
}
