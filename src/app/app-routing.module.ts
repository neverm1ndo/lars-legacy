import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { PageNotFoundComponent } from './shared/components';
// import { AuthComponent } from './auth/auth.component';
// import { DashboardComponent } from './dashboard/dashboard.component';

import { HomeRoutingModule } from './home/home-routing.module';
import { DetailRoutingModule } from './detail/detail-routing.module';

const routes: Routes = [
  { path: '**', redirectTo: 'login'},
  { path: 'dash', loadChildren: () => import('./home/home.module').then(m =>
    m.HomeModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HomeRoutingModule,
    DetailRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
