import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { faTrash, faPencilAlt, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

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
};

@Component({
  selector: 'app-backup-item',
  templateUrl: './backup-item.component.html',
  styleUrls: ['./backup-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackupItemComponent implements OnInit {

  @Input('backup-info') backup: Backup;
  @Input('admin-info') admin: any;
  @Input('willBeDeletedSoon') wbd: boolean;
  @Output() currentToView: EventEmitter<any> = new EventEmitter();

  fa = {
    pen: faPencilAlt,
    trash: faTrash,
    exCircle: faExclamationCircle
  };

  constructor() { }

  toView(backup) {
    this.currentToView.emit(backup);
  }

  ngOnInit(): void {
  }

}
