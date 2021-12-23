import { Component, OnInit, Input } from '@angular/core';

interface Backup {
  user: {
    nickname: string;
    avatar: string;
  },
  file: {
    name: string;
    mime: string;
    created: string;
    expires: string;
    text?: string;
  }
}

@Component({
  selector: 'app-backup-item',
  templateUrl: './backup-item.component.html',
  styleUrls: ['./backup-item.component.scss']
})
export class BackupItemComponent implements OnInit {

  @Input('backup-info') backup: Backup;

  constructor() { }

  ngOnInit(): void {
  }

}
