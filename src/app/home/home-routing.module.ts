import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchEditorComponent } from '@lars/home/search-editor/search-editor.component';
import { AdminsComponent } from './admins/admins.component';

import {
  AuthGuard,
  CommonGuard,
  ConfiguratorGuard,
  BackuperGuard,
  MapperGuard
} from '@lars/guards';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'prefix', redirectTo: 'dash' },
      { path: 'dash', component: DashboardComponent },
      { path: 'search', component: SearchEditorComponent, canActivate: [CommonGuard] },
      {
        path: 'configs',
        loadChildren: () => import('@lars/configs/configs.module').then((m) => m.ConfigsModule),
        canActivate: [ConfiguratorGuard]
      },
      {
        path: 'maps',
        loadChildren: () => import('@lars/mapviewer/mapviewer.module').then((m) => m.MapViewerModule),
        canActivate: [MapperGuard]
      },
      {
        path: 'banhammer',
        loadChildren: () => import('@lars/bans/bans.module').then((m) => m.BansModule),
        canActivate: [CommonGuard]
      },
      { path: 'admins', component: AdminsComponent, canActivate: [CommonGuard] },
      {
        path: 'backups',
        loadChildren: () => import('@lars/backups/backups.module').then((m) => m.BackupsModule),
        canActivate: [BackuperGuard]
      },
      // { path: 'stats', component: StatisticsComponent, canActivate: [CommonGuard] },
      {
        path: 'settings',
        loadChildren: () => import('@lars/settings/settings.module').then((m) => m.SettingsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
