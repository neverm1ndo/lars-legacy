import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ContentDataProps } from '@lars/logs/domain';

@Component({
  selector: 'lars-props-logline-content',
  templateUrl: './props-logline-content.component.html',
  styleUrls: ['./props-logline-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropsLoglineContentComponent {
  @Input() props: ContentDataProps;
}
