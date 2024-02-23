import { BrowserModule } from '@angular/platform-browser';
import { InjectionToken, NgModule, inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeModule } from './home/home.module';

import { AppComponent } from './app.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LibertyIconsModule } from './liberty-icons/liberty-icons.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TopperComponent } from './topper/topper.component';
import { LoginModule } from './login/login.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppConfig } from '../environments/environment';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DevServerControlsModule } from './dev-server-controls/dev-server-controls.module';
import { ToastService } from './toast.service';
import { ToastsContainer } from './toasts-container/toasts-container.component';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http, './assets/i18n/app/', '.json');

export const WINDOW = new InjectionToken<Window>('An abstraction over global window object', {
  factory: () => {
    const { defaultView } = inject(DOCUMENT);

    if (!defaultView) {
      throw new Error('Window is not available');
    }

    return defaultView;
  }
});

@NgModule({
  declarations: [AppComponent, TopperComponent, ToastsContainer],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    HomeModule,
    SharedModule,
    NgbModule,
    FontAwesomeModule,
    LibertyIconsModule,
    BrowserAnimationsModule,
    LoginModule,
    DevServerControlsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: AppConfig.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    RouterModule,
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: AppConfig.production }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [ToastService],
  bootstrap: [AppComponent]
})
export class AppModule {}
