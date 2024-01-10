import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackupsRoutingModule } from './backups.routing.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LibertyIconsModule } from '@lars/liberty-icons/liberty-icons.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSplitModule } from 'angular-split';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { SharedModule } from '@lars/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BackupsComponent } from './containers/backups.component';
import { BackupItemComponent } from './components/backup-item/backup-item.component';
import { BackupsGraphDirective } from './components/backups-graph/backups-graph.directive';
import { BackupsGraphItemDirective } from './components/backups-graph/backups-graph-item.directive';
import { BackupsService } from './domain/inftastructure/backups.service';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/backups/', '.json');
}

@NgModule({
  declarations: [BackupsComponent, BackupItemComponent, BackupsGraphDirective, BackupsGraphItemDirective],
  imports: [
    CommonModule,
    BackupsRoutingModule,
    CodemirrorModule,
    FontAwesomeModule,
    LibertyIconsModule,
    NgbModule,
    AngularSplitModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      },
      isolate: true
    })
  ],
  providers: [BackupsService]
})
export class BackupsModule { }
