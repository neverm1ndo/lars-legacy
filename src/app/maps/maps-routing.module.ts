import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { MapsComponent } from './maps.component';
import { EmptyDocComponent } from '../configs/empty-doc/empty-doc.component';
import { MapEditorV2Component } from './map-editor-v2/map-editor-v2.component';

const routes: Routes = [
  { path: '', component: MapsComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'empty' },
    { path: 'empty', component: EmptyDocComponent },
    { path: 'map', component: MapComponent },
  ]},
  { path: 'medv2', component: MapEditorV2Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapsRoutingModule { }
