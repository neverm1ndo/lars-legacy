import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { MapsComponent } from './maps.component';
import { EmptyDocComponent } from '../empty-doc/empty-doc.component';

const routes: Routes = [
  { path: '', component: MapsComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'empty' },
    { path: 'empty', component: EmptyDocComponent },
    { path: 'map', component: MapComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapsRoutingModule { }
