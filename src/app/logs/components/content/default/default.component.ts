import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ContentData } from '@lars/logs/domain';

@Component({
  selector: 'lars-default-logline-content',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultLogLineContentComponent {
  @Input() content?: ContentData;
}
