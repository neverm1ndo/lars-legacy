import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserData, UserLoginData } from './interfaces/app.interfaces';
import { Router } from '@angular/router';
import { AppConfig } from '../environments/environment';
import { ElectronService } from './core/services/electron/electron.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Workgroup } from './enums/workgroup.enum';

interface UserSettings {
  tray: boolean;
  lineChunk: number;
  listStyle: string;
  textEditorStyle: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly URL_LOGIN: string = AppConfig.api.auth;
  readonly URL_USER: string = AppConfig.api.user;
  user: Subject<UserData | undefined> = new Subject();
  headers: HttpHeaders = new HttpHeaders ({
    'Content-Type': 'application/json'
  });
  error: Subject<any> = new Subject();

  constructor(
    private http: HttpClient,
    private router: Router,
    public electron: ElectronService,
    private idbService: NgxIndexedDBService
  ) {}

  getUser(name: string): Observable<UserData> {
    return this.http.get(this.URL_USER, { params: { name: name }});
  }
  getUserGroupName(userGroup: number): string {
    switch (userGroup) {
      case Workgroup.Challenger: return 'Претендент';
      case Workgroup.Dev: return 'Разработчик';
      case Workgroup.Admin: return 'Админ';
      case Workgroup.Mapper: return 'Маппер';
      case Workgroup.CFR: return 'Редактор конфигурационных файлов';
      case Workgroup.Backuper: return 'Бэкапер';
      default: return 'Игрок';
    }
  }
  getUserSettings(): UserSettings {
    let userSettings = JSON.parse(window.localStorage.getItem('settings'));
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
    this.electron.shell.openExternal('https://www.gta-liberty.ru/memberlist.php?mode=viewprofile&u='+ id.toString())
  }

  getUserInfo(): UserData | null {
    if (localStorage.getItem('user') !== null) {
      return JSON.parse(localStorage.getItem('user'));
    } else {
      return null;
    }
  }
  isAuthenticated(): boolean {
    const userInfo = this.getUserInfo();
    if (userInfo?.token) {
      return true;
    }
    return false;
  }

  setUpUser(user: UserData): Observable<number> {
    return this.idbService.add('user', {
      name: user.name,
      avatar: user.avatar,
      id: user.id,
      group: user.gr
    })
  }

  loginUser(value: UserLoginData): Observable<UserData> {
    return this.http.post<UserLoginData>(this.URL_LOGIN, value, { headers: this.headers })
    .pipe(
      catchError((error) => this.handleError(error))
    ).pipe(
      tap((user: UserData) => {
        if (user && user.token) {
          window.localStorage.setItem('user', JSON.stringify(user));
          const addUserSub = this.setUpUser(user).subscribe(() => {
            const johnny = this.idbService.add('user', { name: 'JohnnyTheDog', id: 42, group: 12, avatar: 'lars://assets/images/doge.png'}).subscribe(() => johnny.unsubscribe());
            addUserSub.unsubscribe();
          });
        }
        this.user.next(user);
        return user;
    }))
  }
  async logOut(): Promise<any> {
    const dialogOpts = {
        type: 'question',
        buttons: ['Да, выйти', 'Отмена'],
        title: 'Подтверждение выхода',
        message: 'Вы точно хотите выйти с аккаунта?'
      }
    return this.electron.dialog.showMessageBox(dialogOpts)
    .then((returnValue) => {
      if (returnValue.response === 0) {
        this.user.next(undefined);
        localStorage.removeItem('user');
        return this.router.navigate(['/login']);
      }
      throw 'REJECTED BY USER'
    })
  }
  private handleError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
      this.error.next(error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
        this.error.next(error);
    }
    return throwError(error);
  }
}
