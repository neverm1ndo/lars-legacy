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

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
    { path: '', pathMatch: 'full', redirectTo: 'dash' },
    { path: 'dash', component: DashboardComponent },
    { path: 'search', component: SearchEditorComponent, canActivate: [IsCommonGuard] },
    { path: 'config-editor', component: ConfigEditorComponent, canActivate: [IsConfiguratorGuard] },
    { path: 'settings', component: SettingsComponent },
    { path: 'maps', component: MapsComponent, canActivate: [IsMapperGuard] },
    { path: 'banhammer', component: BanhammerComponent, canActivate: [IsCommonGuard] },
    { path: 'admins', component: AdminsComponent, canActivate: [IsDevGuard] }
  ]},
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
