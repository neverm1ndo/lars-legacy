import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../guards/auth.guard';
import { IsCommonGuard } from '../guards/is-common.guard';
import { IsConfiguratorGuard } from '../guards/is-configurator.guard';
import { IsDevGuard } from '../guards/is-dev.guard';
import { IsMapperGuard } from '../guards/is-mapper.guard';
import { SearchEditorComponent } from '../search-editor/search-editor.component';
import { ConfigEditorComponent } from '../config-editor/config-editor.component';
import { SettingsComponent } from '../settings/settings.component';
import { MapsComponent } from '../maps/maps.component';
import { BanhammerComponent } from '../banhammer/banhammer.component';
import { AdminsComponent } from '../admins/admins.component';
import { BackupsComponent } from '../backups/backups.component';
import { FilterComponent } from '../filter/filter.component';
import { NotificationsSettingsComponent } from '../notifications-settings/notifications-settings.component';
import { GeneralSettingsComponent } from '../general-settings/general-settings.component';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { EmptyDocComponent } from '../empty-doc/empty-doc.component';
import { BinaryDocComponent } from '../binary-doc/binary-doc.component';
import { MapComponent } from '../maps/map/map.component';
import { LauncherSettingsComponent } from '../launcher-settings/launcher-settings.component';
import { StatisticsComponent } from '../statistics/statistics.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
    { path: '', pathMatch: 'full', redirectTo: 'dash' },
    { path: 'dash', component: DashboardComponent },
    { path: 'search', component: SearchEditorComponent, canActivate: [IsCommonGuard] },
    { path: 'config-editor', component: ConfigEditorComponent, canActivate: [IsConfiguratorGuard], children: [
        { path: '', pathMatch: 'full', redirectTo: 'empty' },
        { path: 'empty', component: EmptyDocComponent },
        { path: 'binary', component: BinaryDocComponent },
        { path: 'doc', component: TextEditorComponent }
    ]},
    { path: 'settings', component: SettingsComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: 'general' },
      { path: 'general', component: GeneralSettingsComponent, data: { animation: 'general' } },
      { path: 'filter', component: FilterComponent, data: { animation: 'filter' } },
      { path: 'alerts', component: NotificationsSettingsComponent, data: { animation: 'alerts' } },
      { path: 'launcher', component: LauncherSettingsComponent, data: { animation: 'launcher' } },
    ]},
    { path: 'maps', component: MapsComponent, canActivate: [IsMapperGuard], children: [
      { path: '', pathMatch: 'full', redirectTo: 'empty' },
      { path: 'empty', component: EmptyDocComponent },
      { path: 'map', component: MapComponent },
    ]},
    { path: 'banhammer', component: BanhammerComponent, canActivate: [IsCommonGuard] },
    { path: 'admins', component: AdminsComponent, canActivate: [IsCommonGuard] },
    { path: 'backups', component: BackupsComponent, canActivate: [IsDevGuard] },
    { path: 'stats', component: StatisticsComponent, canActivate: [IsCommonGuard] },
  ]},
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
