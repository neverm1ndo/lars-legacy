import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard, ConfiguratorGuard } from './guards';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginModule)
  },
  {
    path: 'monitor',
    loadChildren: () =>
      import('./serverlog-monitor/serverlog-monitor.module').then((m) => m.ServerlogMonitorModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'editor',
    loadChildren: () =>
      import('./configs/configs.module').then((m) => m.ConfigsModule),
    canActivate: [AuthGuard, ConfiguratorGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
