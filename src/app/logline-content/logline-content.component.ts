import { Component, OnInit, Input } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { UserService } from '../user.service';
import { Process } from '../line-process/log-processes';

@Component({
  selector: 'logline-content',
  templateUrl: './logline-content.component.html',
  styleUrls: ['./logline-content.component.scss']
})
export class LoglineContentComponent implements OnInit {

  constructor(
    private idbService: NgxIndexedDBService,
    public userService: UserService
  ) { }

  @Input('content') content: string;
  @Input('type') type: Process;

  user: any;

  controltype():boolean {
    switch (this.type.control) {
      case 'authCorrectAdm': return true;
      case 'authIncorrect': return true;
      case 'authCorrectUsr': return true;
      default: return false;
    }
  }

  userLink(id: number) {
    this.userService.openUserProfile(id);
  }

  ngOnInit(): void {
    if (this.controltype()) {
      const idbUserSub = this.idbService.getByIndex('user', 'name', this.content).subscribe((user) => {
        if (!user) {
          const getusrsub = this.userService.getUser(this.content).subscribe((user) => {
            this.user = user;
            this.idbService.add('user', { name: user.name, avatar: user.avatar, id: user.id, group: user.gr })
            getusrsub.unsubscribe();
          });
        } else {
          this.user = user;
        }
        idbUserSub.unsubscribe();
      });
    }
  }

}
