import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleError } from './utils';
import { UserData, UserLoginData, IDBUser } from './interfaces';
import { Router } from '@angular/router';
import { AppConfig } from '../environments/environment';
import { ElectronService } from './core/services';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Workgroup } from './enums';

interface UserSettings {
  tray: boolean;
  lineChunk: number;
  listStyle: string;
  textEditorStyle: string;
}

type UserGroupTranslation = 'Претендент' | 'Разработчик' | 'Админ' | 'Маппер' | 'Редктор конфигурационных файлов' | 'Бэкапер' | 'Игрок';

interface UserGroupTranslationMap {
  [group: number]: UserGroupTranslation;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly URL_LOGIN: string = AppConfig.api.auth;
  readonly URL_USER: string = AppConfig.api.user;
  user: BehaviorSubject<UserData | null> = new BehaviorSubject(this.getUserInfo());
  error: Subject<any> = new Subject();

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _electron: ElectronService,
    private _idbService: NgxIndexedDBService
  ) {}

  getUser(name: string): Observable<UserData> {
    return this._http.get(this.URL_USER, { params: { name: name }});
  }

  getUserGroupName(userGroup: number | Workgroup): UserGroupTranslation {
    const groupMap: UserGroupTranslationMap = {
      [Workgroup.Challenger]: 'Претендент',
      [Workgroup.Dev]: 'Разработчик',
      [Workgroup.Admin]: 'Админ',
      [Workgroup.Mapper]: 'Маппер',
      [Workgroup.CFR]: 'Редктор конфигурационных файлов',
      [Workgroup.Backuper]: 'Бэкапер',
    };
    if (!groupMap[userGroup]) return 'Игрок';
    return groupMap[userGroup];
  }

  getUserSettings(): UserSettings {
    let userSettings: UserSettings = JSON.parse(window.localStorage.getItem('settings'));
    const defaultSettings: UserSettings = {
      tray: false,
      lineChunk: 100,
      listStyle: 'small',
      textEditorStyle: 'material',
    }
    const defaultAlerts = {
      silent: false,
      playerReport: true,
      autoBan: true,
      autoBlock: true,
      serverShutdown: true,
      serverRestart: true,
    }
    if (!userSettings) {
      window.localStorage.setItem('settings', JSON.stringify(defaultSettings));
      window.localStorage.setItem('alerts', JSON.stringify(defaultAlerts));
      return defaultSettings;
    }
    return userSettings;
  }

  openUserProfile(id: number): void {
    const url = new URL('/memberlist.php', AppConfig.links.resource);
          url.searchParams.append('mode', 'viewprofile');
          url.searchParams.append('u', id.toString());
    this._electron.shell.openExternal(url.toString());
  }

  openForum(): void {
    const url = new URL('/index.php', AppConfig.links.resource);
    this._electron.shell.openExternal(url.toString());
  }

  getUserInfo(): UserData | null {
    if (localStorage.getItem('user') == null) return null;
    return JSON.parse(localStorage.getItem('user'));
  }

  isAuthenticated(): boolean {
    const userInfo = this.getUserInfo();
    if (!userInfo?.token) return false;
    return true;
  }

  setUpUser(user: UserData): Observable<IDBUser> {
    return this._idbService.add('user', {
      id: user.id,
      name: user.username,
      avatar: user.avatar,
      group: user.main_group
    });
  }

  loginUser(value: UserLoginData): Observable<any> {
    return this._http.post<UserLoginData>(this.URL_LOGIN, value, { headers: new HttpHeaders ({
      'Content-Type': 'application/json'
    })})
    .pipe(
      catchError((error) => handleError(error))
    );
  }

  async logOut(): Promise<any> {
    const messageBox: Electron.MessageBoxOptions = {
      type: 'question',
      buttons: ['Да, выйти', 'Отмена'],
      title: 'Подтверждение выхода',
      message: 'Вы точно хотите выйти с аккаунта?'
    };
    this._electron.ipcRenderer.invoke('message-box', messageBox).then((returnValue: Electron.MessageBoxReturnValue) => {
      if (returnValue.response !== 0) throw 'REJECTED BY USER';
      this.user.next(undefined);
      localStorage.removeItem('user');
      return this._router.navigate(['/login']);
    });
  }
}
