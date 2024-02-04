import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ContentDataTarget } from '@lars/logs/domain';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'lars-target-logline-content',
  templateUrl: './target-logline-content.component.html',
  styleUrls: ['./target-logline-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TargetLoglineContentComponent {
  @Input() target: ContentDataTarget;

  icon = faUserAlt;
}
