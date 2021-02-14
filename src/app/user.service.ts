import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserData, UserLoginData } from './interfaces/app.interfaces';
import { Router } from '@angular/router';
import { AppConfig } from '../environments/environment.dev';
import { ElectronService } from './core/services/electron/electron.service';
import { WebSocketService } from './web-socket.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';

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
    private idbService: NgxIndexedDBService,
    private ws: WebSocketService
  ) {}

  getUser(name: string): Observable<UserData> {
    return this.http.get(this.URL_USER, { params: { name: name }});
  }
  getUserGroupName(): string {
    switch (this.getUserInfo().gr) {
      case 9: return 'Претендент';
      case 10: return 'Разработчик';
      case 11: return 'Админ';
      case 12: return 'Маппер';
      case 13: return 'Редактор конфигурационных файлов';
      default: return 'Игрок';
    }
  }
  getUserSettings(): any {
    if (!localStorage.getItem('settings')) {
      localStorage.setItem('settings', JSON.stringify({
        tray: false,
        lineChunk: 100,
        listStyle: 'small',
        textEditorStyle: 'material'
      }));
    }
    if (localStorage.getItem('settings') !== null) {
      return JSON.parse(localStorage.getItem('settings'));
    } else {
      return null;
    }
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
    if (this.getUserInfo()) {
      const token = this.getUserInfo().token;
      if (token) return true;
    } else {
      return false;
    }
  }
  loginUser(value: UserLoginData): Observable<UserData> {
    return this.http.post<UserLoginData>(this.URL_LOGIN, value, { headers: this.headers })
    .pipe(
      catchError((error) => this.handleError(error))
    ).pipe(
      tap(user => {
        if (user && user.token) {
          localStorage.setItem('user', JSON.stringify(user));
          const addUserSub = this.idbService.add('user', {
            name: user.name,
            avatar: user.avatar,
            id: user.id,
            group: user.gr
          }).subscribe(() => {
            const johnny = this.idbService.add('user', { name: 'JohnnyTheDog', id: 42, group: 12, avatar: './assets/images/doge.png'}).subscribe(() => johnny.unsubscribe());
            addUserSub.unsubscribe();
          });
        }
        this.user.next(user);
        return user;
    }))
  }
  logOut(): void {
    const dialogOpts = {
        type: 'question',
        buttons: ['Да, выйти', 'Отмена'],
        title: 'Подтверждение выхода',
        message: 'Вы точно хотите выйти с аккаунта?'
      }
    this.electron.dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) {
        this.user.next(undefined);
        localStorage.removeItem('user');
        this.ws.disconnect();
        this.router.navigate(['/login']);
      }
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
