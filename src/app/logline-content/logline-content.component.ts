import { Component, OnInit, Input } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { UserService } from '../user.service';

@Component({
  selector: 'logline-content',
  templateUrl: './logline-content.component.html',
  styleUrls: ['./logline-content.component.scss']
})
export class LoglineContentComponent implements OnInit {

  constructor(
    private idbService: NgxIndexedDBService,
    private userService: UserService
  ) { }

  @Input('content') content: string;
  @Input('type') type: any;

  user: any;

  controltype():boolean {
    switch (this.type.control) {
      case 'authCorrectAdm': return true;
      case 'authIncorrect': return true;
      default: return false;
    }
  }

  userGroup(gr: number): string {
    switch (gr) {
      case 9: return 'Претендент';
      case 10: return 'Разработчик';
      case 11: return 'Админ';
      case 12: return 'Маппер';
      case 13: return 'Редактор конфигурационных файлов';
      default: return 'Игрок';
    }
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
