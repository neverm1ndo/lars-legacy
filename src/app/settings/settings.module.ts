import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { FilterComponent } from './filter/filter.component';
import { NotificationsSettingsComponent } from './notifications-settings/notifications-settings.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { SettingsComponent } from './settings.component';
import { LauncherSettingsComponent } from './launcher-settings/launcher-settings.component';

@NgModule({
  declarations: [FilterComponent, NotificationsSettingsComponent, GeneralSettingsComponent, LauncherSettingsComponent, SettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    NgbModule,
    CodemirrorModule,
    FontAwesomeModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SettingsModule { }
