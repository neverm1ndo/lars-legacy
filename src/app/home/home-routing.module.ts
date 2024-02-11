import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
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
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dash' },
      { path: 'dash', component: DashboardComponent },
      {
        path: 'logs',
        loadChildren: () => import('@lars/logs/logs.module').then((m) => m.LogsModule),
        canActivate: [CommonGuard]
      },
      {
        path: 'configs',
        loadChildren: () => import('@lars/configs/configs.module').then((m) => m.ConfigsModule),
        canActivate: [ConfiguratorGuard]
      },
      {
        path: 'maps',
        loadChildren: () => import('@lars/maps/maps.module').then((m) => m.MapsModule),
        canActivate: [MapperGuard]
      },
      {
        path: 'banhammer',
        loadChildren: () => import('@lars/bans/bans.module').then((m) => m.BansModule),
        canActivate: [CommonGuard]
      },
      {
        path: 'admins',
        component: AdminsComponent,
        canActivate: [CommonGuard]
      },
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
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
