import { Component, OnInit, AfterViewInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { UserService } from '../user.service';
import { Process } from '@lars/shared/components/line-process/log-processes';
import { IContentData, IUserData } from '@lars/interfaces';
import { switchMap, catchError } from 'rxjs/operators';
import { iif, Observable, of } from 'rxjs';

@Component({
  selector: 'logline-content',
  templateUrl: './logline-content.component.html',
  styleUrls: ['./logline-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoglineContentComponent implements OnInit, AfterViewInit {

  constructor(
    private _idb: NgxIndexedDBService,
    private _user: UserService,
    private _cdr: ChangeDetectorRef,
  ) { }

  @Input('content') content: IContentData;
  @Input('type') type: Process;


  public contentTpl: TemplateRef<any>;

  public user$: Observable<IUserData>;

  @ViewChild('auth') auth: TemplateRef<any>;
  @ViewChild('default') default: TemplateRef<any>;
  @ViewChild('ban') ban: TemplateRef<any>;
  @ViewChild('mute') mute: TemplateRef<any>;
  @ViewChild('death') death: TemplateRef<any>;
  @ViewChild('cn') cn: TemplateRef<any>;

  private _isAuth(): boolean {
    switch (this.type.control) {
      case 'authCorrectAdm': return true;
      case 'authIncorrect': return true;
      case 'authCorrectUsr': return true;
      default: return false;
    }
  }

  private _isBanned(): boolean {
    const banned = ['disconnectBan', 'disconnectKick']
    return banned.includes(this.type.control);
  }
  private _isMuted(): boolean {
    const banned = ['chatHandBlock'];
    return banned.includes(this.type.control);
  }
  private _isDeath(): boolean {
    return this.type.control === 'dthKilled';
  }
  private _isCNRes(): boolean {
    return this.type.control === 'CnResSuccess';
  }

  userLink(id: number) {
    this._user.openUserForumProfile(id);
  }

  private _setTemplate(): TemplateRef<any> {
    switch (true) {
      case this._isBanned():
        return this.ban;   
      case this._isMuted():      
        return this.mute;
      case this._isDeath():
        return this.death;
      case this._isCNRes():
        return this.cn;
      case this._isAuth():
           this.user$ = this._idb.getByIndex('user', 'username', this.content.message)
                .pipe(
                  switchMap((user) => iif(() => !user, 
                                          this._user.getUserByUsername(this.content.message)
                                                    .pipe(
                                                      switchMap(({ username, avatar, main_group, secondary_group, id }) => this._idb.add('user', {
                                                        id,
                                                        username,
                                                        avatar,
                                                        main_group,
                                                        secondary_group,
                                                      })),
                                                      catchError(() => this._idb.getByIndex('user', 'username', this.content.message))
                                                    ), 
                                          of(user))),
                );
        return this.auth;
      default:
        return this.default;
    }
  }

  ngAfterViewInit(): void {
    this.contentTpl = this._setTemplate();
    this._cdr.detectChanges();
  }

  ngOnInit(): void {}
}
