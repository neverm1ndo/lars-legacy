import { Component, OnInit, Input } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { UserService } from '../user.service';
import { Process } from '../line-process/log-processes';
import { take, map, switchMap, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'logline-content',
  templateUrl: './logline-content.component.html',
  styleUrls: ['./logline-content.component.scss']
})
export class LoglineContentComponent implements OnInit {

  constructor(
    private idb: NgxIndexedDBService,
    private user: UserService
  ) { }

  @Input('content') content: string;
  @Input('type') type: Process;

  customTemplate: boolean;

  userContent: any;

  controltype():boolean {
    switch (this.type.control) {
      case 'authCorrectAdm': return true;
      case 'authIncorrect': return true;
      case 'authCorrectUsr': return true;
      default: return false;
    }
  }

  isBanned() {
    const banned = ['disconnectBan', 'disconnectKick']
    return banned.includes(this.type.control);
  }

  userLink(id: number) {
    this.user.openUserProfile(id);
  }

  ngOnInit(): void {
    if (this.isBanned() || this.controltype()) {
      this.customTemplate = true;
    }
    if (this.controltype()) {
      this.idb.getByIndex('user', 'name', this.content)
        .pipe(take(1))
        .pipe(tap((user) => {
          if (user) {
            this.userContent = user;
          }
          return user
        }))
        .pipe(filter((user) => !user))
        .pipe(switchMap(() => this.user.getUser(this.content)
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
      });
      return;
    }
  }
}
