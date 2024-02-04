import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { faSearch, faUserAlt, faSkullCrossbones } from '@fortawesome/free-solid-svg-icons';
import { ContentData, ContentTemplate, Process, contentTemplateMap } from '@lars/logs/domain';

@Component({
  selector: 'lars-logline-content',
  templateUrl: './logline-content.component.html',
  styleUrls: ['./logline-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoglineContentComponent implements OnInit {
  constructor() {}

  public fa = {
    faSearch,
    faUserAlt,
    faSkullCrossbones
  };

  @Input() content: ContentData;
  @Input() process: Process;

  public isKickBanned = ContentTemplate.BANNED;
  public isAuthenticated = ContentTemplate.AUTHENTICATED;
  public isChatMuted = ContentTemplate.MUTED;
  public isDead = ContentTemplate.DEAD;
  public isCookieNumber = ContentTemplate.CN;
  public isTargeted = ContentTemplate.TARGETED;
  public isProps = ContentTemplate.PROPS;

  public contentType?: ContentTemplate;

  ngOnInit(): void {
    this.setContentType();
  }

  setContentType() {
    if (this.content.target) return ContentTemplate.TARGETED;
    if (this.content.props) return ContentTemplate.PROPS;

    return contentTemplateMap.get(this.process.control);
  }
}
