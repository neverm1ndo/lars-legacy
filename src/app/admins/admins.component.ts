import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { faUserSecret, faPooStorm, faWind, faMap, faFileSignature, faSearch, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../user.service';
import { ApiService } from '../api.service';
import { ToastService } from '../toast.service';
import { settings } from '../app.animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ElectronService } from '../core/services/electron/electron.service';
import { WebSocketService } from '../web-socket.service';
import { Subscription } from 'rxjs';

type UserActivityType = 'redacting' | 'idle' | 'inlogs' | 'inmaps' | 'inadm' | 'inbacks';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss'],
  animations: [settings]
})
export class AdminsComponent implements OnInit, OnDestroy {

  admins: any[] = [];

  fa = {
    agent: faUserSecret,
    poo: faPooStorm,
    search: faSearch,
    wind: faWind,
    map: faMap,
    conf: faFileSignature,
    box: faBoxOpen
  }
  usersStates = {};
  popup: boolean = false;

  addAdminForm: FormGroup = new FormGroup({
    nickname: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
    mainGroup: new FormControl(9, [
      Validators.required
    ]),
    secondaryGroup: new FormControl(9)
  });
  $activies: Subscription;

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
    private toast: ToastService,
    private electron: ElectronService,
    public ws: WebSocketService
  ) { }

  userActionTranslation(action: UserActivityType): string {
    const actions = {
      idle: 'Спит',
      inlogs: 'Просматривает логи',
      inmaps: 'В редакторе карт',
      redacting: 'В редакторе конфигов',
      inadm: 'В списке админов',
      inbacks: 'Просматривает бэкапы'
    }
    let act = actions[action];
    if (!act) return '???';
    return act;
  }


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
      this.admins = admins;
    });
  }
  getFullAdminsAll() {
    this.api.getAdminsList().subscribe((admins: any) => {
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
      }
    this.electron.dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) {
        this.changeAdminGroup(username, id, 2);
        setTimeout(() => {
          this.getFullAdminsList();
        }, 500);
      }
    })
  }
  closeAdminSession(username: string) {
    const dialogOpts = {
        type: 'question',
        buttons: ['Зарыть сессию', 'Отмена'],
        title: 'Подтверждение закрытия сессии',
        message: `Вы точно хотите закрыть сессию ${username}? Токен доступа пользователя ${username} к LARS будет сброшен.`
      }
    this.electron.dialog.showMessageBox(dialogOpts).then((returnValue) => {
      console.log(returnValue.response)
      if (returnValue.response === 0) {
        this.api.closeAdminSession(username).subscribe(() => {
          this.toast.show(`Закрыта сессия LARS пользователя <b>${ username }</b>. Токен доступа сброшен.`,
            {
              classname: 'bg-success text-light',
              delay: 3000,
              icon: faUserSecret
            });
        });
      }
    })
  }

  changeAdminGroup(username: string, id: number, group: number) {
    this.api.setAdminGroup(id, group).subscribe(() => {
      this.toast.show(`Админ <b>${ username }</b> перемещен в группу <b>${ this.userService.getUserGroupName(group)}</b>`,
        {
          classname: 'bg-success text-light',
          delay: 3000,
          icon: faUserSecret
        });
    });
  }
  changeSecondaryAdminGroup(username: string, id: number, group: number) {
    this.api.setAdminSecondaryGroup(id, group).subscribe(() => {
      this.toast.show(`Админ <b>${ username }</b> перемещен в группу <b>${ this.userService.getUserGroupName(group)}</b>`,
        {
          classname: 'bg-success text-light',
          delay: 3000,
          icon: faUserSecret
        });
    });
  }

  ngOnInit(): void {
    this.getFullAdminsList();
    this.$activies = this.ws.getUserActitvity().subscribe((act) => {
      this.usersStates[act.user] = act.action;
    })
  }
  ngOnDestroy(): void {
    this.$activies.unsubscribe();
  }

}
