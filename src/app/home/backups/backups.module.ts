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

import { BackupsComponent } from './backups.component';
import { BackupItemComponent } from './backup-item/backup-item.component';
import { BackupsGraphDirective } from './directives/backups-graph.directive';
import { BackupsGraphItemDirective } from './directives/backups-graph-item.directive';
import { BackupsService } from './backups.service';

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
  ],
  providers: [BackupsService]
})
export class BackupsModule { }
