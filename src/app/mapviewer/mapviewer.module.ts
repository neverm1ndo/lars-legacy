import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapViewerRoutingModule } from './mapviewer-routing.module';
import { ShellComponent } from './shell/shell.component';
import { LtyFileTreeModule } from '@lars/shared/lty-file-tree/lty-file-tree.module';
import { MapViewerDomainModule } from './domain/mapviewer-domain.module';


@NgModule({
  declarations: [
    ShellComponent
  ],
  imports: [
    CommonModule,
    MapViewerRoutingModule,
    MapViewerDomainModule,
    LtyFileTreeModule
  ]
})
export class MapViewerModule { }
