import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsFacade } from './application';
import { StoreModule } from '@ngrx/store';
import * as fromLogs from './state/logs.reducer';
import { EffectsModule } from '@ngrx/effects';
import { LogsEffects } from './state/logs.effects';



@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(fromLogs.featureKey, fromLogs.logsReducer),
    EffectsModule.forFeature([LogsEffects])
  ],
  providers: [
    LogsFacade
  ]
})
export class LogsDomainModule { }
