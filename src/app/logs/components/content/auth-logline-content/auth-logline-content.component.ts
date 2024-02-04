import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ContentData, Process } from '@lars/logs/domain';

@Component({
  selector: 'lars-auth-logline-content',
  templateUrl: './auth-logline-content.component.html',
  styleUrls: ['./auth-logline-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthLoglineContentComponent {
  @Input() content: ContentData;
  @Input() process: Process;

  userLink(id: number) {}
}
