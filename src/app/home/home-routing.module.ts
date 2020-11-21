import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../guards/auth.guard';
import { SearchEditorComponent } from '../search-editor/search-editor.component';
import { ConfigEditorComponent } from '../config-editor/config-editor.component';
import { SettingsComponent } from '../settings/settings.component';
import { MapsComponent } from '../maps/maps.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
    { path: '', pathMatch: 'full', redirectTo: 'dash' },
    { path: 'dash', component: DashboardComponent },
    { path: 'search', component: SearchEditorComponent },
    { path: 'config-editor', component: ConfigEditorComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'maps', component: MapsComponent },
  ]},
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
