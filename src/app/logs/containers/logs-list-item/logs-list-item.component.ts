import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { faFingerprint, faGlobe, faSadTear } from '@fortawesome/free-solid-svg-icons';
import { DefaultLogLineContentComponent } from '@lars/logs/components/content/default/default.component';
import { LogLine } from '@lars/logs/domain';

@Component({
  selector: 'lars-logs-list-item',
  templateUrl: './logs-list-item.component.html',
  styleUrls: ['./logs-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogsListItemComponent implements OnInit {
  @Input() logline: LogLine;

  public readonly fa = {
    faGlobe,
    faSadTear,
    faFingerprint
  };

  constructor() {}

  ngOnInit(): void {
    // this.setContent();
  }
}
