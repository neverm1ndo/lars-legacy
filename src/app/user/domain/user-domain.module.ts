import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import * as fromUser from './state/user.reducer';
import { UserFacade } from './application';
import { UserEffects } from './state';



@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(fromUser.featureKey, fromUser.userReducer),
    EffectsModule.forFeature([UserEffects])
  ],
  providers: [
    UserFacade
  ]
})
export class UserDomainModule { }
