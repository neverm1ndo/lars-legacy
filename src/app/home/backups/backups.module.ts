import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackupsRoutingModule } from './backups.routing.module';

import { LtyFileTreeModule } from '@lars/lty-file-tree/lty-file-tree.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LibertyIconsModule } from '@lars/liberty-icons/liberty-icons.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSplitModule } from 'angular-split';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { SharedModule } from '@lars/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BackupsComponent } from './backups.component';
import { BackupItemComponent } from './backup-item/backup-item.component';

@NgModule({
  declarations: [BackupsComponent, BackupItemComponent],
  imports: [
    CommonModule,
    BackupsRoutingModule,
    CodemirrorModule,
    LtyFileTreeModule,
    FontAwesomeModule,
    LibertyIconsModule,
    NgbModule,
    AngularSplitModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class BackupsModule { }
