import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

interface Backup {
  unix: number;
  date: Date,
  expires: Date,
  action: 'change' | 'delete';
  user: {
    nickname: string;
    group_id: string;
  },
  file: {
    name: string;
    mime: string;
    path: string;
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
  @Output() currentToView: EventEmitter<any> = new EventEmitter();

  constructor() { }

  toView(backup) {
    this.currentToView.emit(backup);
  }

  ngOnInit(): void {
  }

}
