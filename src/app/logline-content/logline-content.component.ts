import { Component, OnInit, AfterViewInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { UserService } from '../user.service';
import { Process } from '../line-process/log-processes';
import { ContentData } from '../interfaces';
import { take, map, switchMap, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'logline-content',
  templateUrl: './logline-content.component.html',
  styleUrls: ['./logline-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoglineContentComponent implements OnInit, AfterViewInit {

  constructor(
    private idb: NgxIndexedDBService,
    private user: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  @Input('content') content: ContentData;
  @Input('type') type: Process;

  contentTpl: TemplateRef<any>;

  @ViewChild('auth') auth: TemplateRef<any>;
  @ViewChild('default') default: TemplateRef<any>;
  @ViewChild('ban') ban: TemplateRef<any>;
  @ViewChild('mute') mute: TemplateRef<any>;
  @ViewChild('death') death: TemplateRef<any>;
  @ViewChild('cn') cn: TemplateRef<any>;

  userContent: any;

  controltype():boolean {
    switch (this.type.control) {
      case 'authCorrectAdm': return true;
      case 'authIncorrect': return true;
      case 'authCorrectUsr': return true;
      default: return false;
    }
  }

  isBanned(): boolean {
    const banned = ['disconnectBan', 'disconnectKick']
    return banned.includes(this.type.control);
  }
  isMuted(): boolean {
    const banned = ['chatHandBlock'];
    return banned.includes(this.type.control);
  }
  isDeath(): boolean {
    return this.type.control === 'dthKilled';
  }
  isCNRes(): boolean {
    return this.type.control === 'CnResSuccess';
  }

  userLink(id: number) {
    this.user.openUserProfile(id);
  }

  ngAfterViewInit(): void {
    this.contentTpl = this.default;
    if (this.isBanned()) {
      this.contentTpl = this.ban;
    }
    if (this.isMuted()) {
      this.contentTpl = this.ban;
    }
    if (this.isDeath()) {
      this.contentTpl = this.death;
    }
    if (this.isCNRes()) {
      this.contentTpl = this.cn;
    }
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    if (this.controltype()) {
      this.idb.getByIndex('user', 'name', this.content.message)
        .pipe(take(1))
        .pipe(tap((user) => {
          if (user) {
            this.userContent = user;
            this.contentTpl = this.auth;
            this.cdr.detectChanges();
          }
          return user;
        }))
        .pipe(filter((user) => !user))
        .pipe(switchMap(() => this.user.getUser(this.content.message)
        .pipe(map((user) => {
          return {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            group: user.gr
          }
        }))
        .pipe(switchMap((user) => this.idb.add('user', user)))
      ))
      .subscribe((user) => {
        this.userContent = user;
        this.contentTpl = this.auth;
        this.cdr.detectChanges();
      });
      return;
    }
  }
}
