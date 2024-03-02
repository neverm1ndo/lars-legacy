import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewerService } from './infrastructure/mapviewer.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    MapViewerService
  ]
})
export class MapViewerDomainModule { }
