import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapViewerRoutingModule } from './mapviewer-routing.module';
import { ShellComponent } from './shell/shell.component';


@NgModule({
  declarations: [
    ShellComponent
  ],
  imports: [
    CommonModule,
    MapViewerRoutingModule
  ]
})
export class MapViewerModule { }
