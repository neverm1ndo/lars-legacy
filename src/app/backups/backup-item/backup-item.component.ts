import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { faTrash, faPencilAlt, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { Backup } from '../../interfaces';

@Component({
  selector: 'app-backup-item',
  templateUrl: './backup-item.component.html',
  styleUrls: ['./backup-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackupItemComponent implements OnInit {

  @Input('backup-info') backup: Backup;
  // @Input('admin-info') admin: any;
  // @Input('willBeDeletedSoon') wbd: boolean;
  // @Output() currentToView: EventEmitter<any> = new EventEmitter();

  fa = {
    pen: faPencilAlt,
    trash: faTrash,
    exCircle: faExclamationCircle
  };

  constructor() { }
  ngOnInit(): void {
  }

}
