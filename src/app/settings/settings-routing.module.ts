import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FilterComponent } from './filter/filter.component';
import { NotificationsSettingsComponent } from './notifications-settings/notifications-settings.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { SettingsComponent } from './settings.component';
import { LauncherSettingsComponent } from './launcher-settings/launcher-settings.component';

const routes: Routes = [
  { path: '', component: SettingsComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'general' },
    { path: 'general', component: GeneralSettingsComponent, data: { animation: 'general' } },
    { path: 'filter', component: FilterComponent, data: { animation: 'filter' } },
    { path: 'alerts', component: NotificationsSettingsComponent, data: { animation: 'alerts' } },
    { path: 'launcher', component: LauncherSettingsComponent, data: { animation: 'launcher' } },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
