import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BansRoutingModule } from './bans-routing.module';
import { BanhammerComponent } from './containers/banhammer/banhammer.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LibertyIconsModule } from '@lars/liberty-icons/liberty-icons.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { SharedModule } from '@lars/shared/shared.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/bans/', '.json');
}

@NgModule({
  declarations: [BanhammerComponent],
  imports: [
    CommonModule,
    BansRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    LibertyIconsModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    })
  ]
})
export class BansModule {}
