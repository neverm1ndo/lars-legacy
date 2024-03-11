import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewerService } from './infrastructure/mapviewer.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MapViewerEffects } from './state/mapviewer.effects';
import * as fromMapViewer from './state/mapviewer.reducer';
import { MapViewerFacade } from './application/mapviewer.facade';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromMapViewer.featureKey, fromMapViewer.logsReducer),
    EffectsModule.forFeature([MapViewerEffects])
  ],
  providers: [
    MapViewerService,
    MapViewerFacade
  ]
})
export class MapViewerDomainModule { }
