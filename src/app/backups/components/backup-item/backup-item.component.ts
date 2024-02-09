import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import {
  faTrash,
  faPencilAlt,
  faExclamationCircle,
  faFileArchive
} from '@fortawesome/free-solid-svg-icons';
import { Backup } from '@lars/interfaces';

@Component({
  selector: 'app-backup-item',
  templateUrl: './backup-item.component.html',
  styleUrls: ['./backup-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackupItemComponent {
  @Input('backup-info') backup: Backup;

  fa = {
    pen: faPencilAlt,
    trash: faTrash,
    exCircle: faExclamationCircle,
    archive: faFileArchive
  };

  constructor() {}
}
