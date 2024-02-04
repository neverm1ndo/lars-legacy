import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ContentData } from '@lars/logs/domain';
import { faSkullCrossbones } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'lars-death-logline-content',
  templateUrl: './death-logline-content.component.html',
  styleUrls: ['./death-logline-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeathLoglineContentComponent {
  @Input() content: ContentData;

  icon = faSkullCrossbones;
}
