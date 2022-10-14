import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchEditorComponent } from '../search-editor/search-editor.component';
import { BanhammerComponent } from '../banhammer/banhammer.component';
import { AdminsComponent } from '../admins/admins.component';
import { StatisticsComponent } from '../statistics/statistics.component';

import { AuthGuard } from '../guards/auth.guard';
import { IsCommonGuard } from '../guards/is-common.guard';
import { IsConfiguratorGuard } from '../guards/is-configurator.guard';
import { IsBackuperGuard } from '../guards/is-backuper.guard';
import { IsMapperGuard } from '../guards/is-mapper.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
    { path: '', pathMatch: 'full', redirectTo: 'dash' },
    { path: 'dash', component: DashboardComponent },
    { path: 'search', component: SearchEditorComponent, canActivate: [IsCommonGuard] },
    { path: 'configs', loadChildren: () => import('../configs/configs.module').then(m => m.ConfigsModule), canActivate: [IsConfiguratorGuard]},
    { path: 'settings', loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule) },
    { path: 'maps', loadChildren: () => import('../maps/maps.module').then(m => m.MapsModule), canActivate: [IsMapperGuard]},
    { path: 'banhammer', component: BanhammerComponent, canActivate: [IsCommonGuard] },
    { path: 'admins', component: AdminsComponent, canActivate: [IsCommonGuard] },
    { path: 'backups', loadChildren: () => import('../backups/backups.module').then(m => m.BackupsModule), canActivate: [IsBackuperGuard] },
    { path: 'stats', component: StatisticsComponent, canActivate: [IsCommonGuard] },
  ]},
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
