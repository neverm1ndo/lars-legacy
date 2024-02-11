import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, from } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { handleError } from '@lars/utils';
import { IUserData, IUserLoginData } from '../../../interfaces';
import { Router } from '@angular/router';
import { AppConfig } from '../../../../environments/environment';
import { ElectronService } from '@lars/core/services';
import { Workgroup } from '@lars/enums';
import { ToastService } from '../../../toast.service';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export interface IUserSettings {
  tray: boolean;
  lineChunk: number;
  listStyle: string;
  textEditorStyle: string;
  alerts: IUserAlertsSettings;
}

interface IUserAlertsSettings {
  silent: boolean;
  playerReport: boolean;
  autoBan: boolean;
  autoBlock: boolean;
  serverShutdown: boolean;
  serverRestart: boolean;
}

type UserGroupTranslation =
  | 'Претендент'
  | 'Разработчик'
  | 'Админ'
  | 'Маппер'
  | 'Редктор конфигурационных файлов'
  | 'Бэкапер'
  | 'Игрок';

interface UserGroupTranslationMap {
  [group: number]: UserGroupTranslation;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly URL_LOGIN: string = AppConfig.api.auth + 'login';
  readonly URL_LOGOUT: string = AppConfig.api.auth + 'logout';
  readonly URL_USER: string = AppConfig.api.user;

  public loggedInUser$: BehaviorSubject<IUserData | null> = new BehaviorSubject(null);
  public error$: Subject<any> = new Subject();

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _electron: ElectronService,
    private _toast: ToastService
  ) {
    this._checkUserSettings();
  }

  private _checkUserSettings(): void {
    if (window.localStorage.getItem('settings') !== null) return;
    const { tray, textEditorStyle, lineChunk, listStyle, alerts }: IUserSettings =
      this.getUserSettings();

    const setup: [string, any][] = [
      ['settings', { tray, textEditorStyle, lineChunk, listStyle }],
      ['alerts', alerts]
    ];

    for (const [key, value] of setup) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }

  public getUserByUsername(username: string): Observable<IUserData> {
    return this._http.get<IUserData>(this.URL_USER, {
      params: { name: username }
    });
  }

  public getUserGroupName(userGroup: Workgroup | number): UserGroupTranslation {
    const groupMap: UserGroupTranslationMap = {
      [Workgroup.Challenger]: 'Претендент',
      [Workgroup.Dev]: 'Разработчик',
      [Workgroup.Admin]: 'Админ',
      [Workgroup.Mapper]: 'Маппер',
      [Workgroup.CFR]: 'Редктор конфигурационных файлов',
      [Workgroup.Backuper]: 'Бэкапер'
    };
    if (!groupMap[userGroup]) return 'Игрок';
    return groupMap[userGroup];
  }

  public showAccessError() {
    const { main_group, permissions } = this.loggedInUser$.getValue();
    this._toast.show(
      'danger',
      'Доступ запрещен для вашей группы пользователей',
      null,
      faExclamationTriangle
    );
  }

  public getUserSettings(): IUserSettings {
    const EMPTY_SETTINGS_ERROR: Error = new Error(
      'Empty user settings. Recovered to default values.'
    );

    try {
      const settingsAsString: string | null = window.localStorage.getItem('settings');
      if (!settingsAsString) throw EMPTY_SETTINGS_ERROR;
      return JSON.parse(settingsAsString);
    } catch (err) {
      console.warn(err);
      return {
        tray: false,
        lineChunk: 100,
        listStyle: 'inline',
        textEditorStyle: 'nord',
        alerts: {
          silent: false,
          playerReport: true,
          autoBan: true,
          autoBlock: true,
          serverShutdown: true,
          serverRestart: true
        }
      };
    }
  }

  public openUserForumProfile(id: number): void {
    const url = new URL('/memberlist.php', AppConfig.links.resource);
    url.searchParams.append('mode', 'viewprofile');
    url.searchParams.append('u', id.toString());
    this._electron.shell.openExternal(url.toString());
  }

  public openUserForumProfileSettings(): void {
    const url = new URL('/ucp.php', AppConfig.links.resource);
    url.searchParams.append('i', '184');
    this._electron.shell.openExternal(url.toString());
  }

  public openForum(): void {
    const url = new URL('/index.php', AppConfig.links.resource);
    this._electron.shell.openExternal(url.toString());
  }

  public getCurrentUserInfo(): IUserData | null {
    if (window.localStorage.getItem('user') == null) return null;
    return JSON.parse(window.localStorage.getItem('user'));
  }

  public isAuthenticated(): boolean {
    const userInfo = this.getCurrentUserInfo();
    if (!userInfo) return false;

    this.loggedInUser$.next(userInfo);

    return true;
  }

  public loginUser(loginData: IUserLoginData): Observable<IUserData | HttpErrorResponse> {
    return this._http
      .post<IUserData>(this.URL_LOGIN, loginData, {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError((error) => handleError(error)));
  }

  public logoutUser(): void {
    const messageBox: Electron.MessageBoxOptions = {
      type: 'question',
      buttons: ['Да, выйти', 'Отмена'],
      title: 'Подтверждение выхода',
      message: 'Вы точно хотите выйти с аккаунта? Подтверждение завершит текущую активную сессию.'
    };
    from(this._electron.ipcRenderer.invoke('message-box', messageBox))
      .pipe(
        filter((returnValue: Electron.MessageBoxReturnValue) => returnValue.response === 0),
        switchMap(() => this._http.post(this.URL_LOGOUT, {}, { responseType: 'text' }))
      )
      .subscribe({
        next: () => {
          this.loggedInUser$.next(null);
          localStorage.removeItem('user');
          this._router.navigate(['/login']);
        },
        error: console.error
      });
  }
}
