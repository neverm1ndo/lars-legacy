import { BrowserModule } from '@angular/platform-browser';
import { InjectionToken, NgModule, inject } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';


import { WebSocketService, socketConfig } from './ws/web-socket.service';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HttpClient } from '@angular/common/http';
import { JWTInterceptor } from './api/interceptors/jwt.interceptor';
import { SocketIoModule } from 'ngx-socket-io';
import { TopbarModule } from './topbar/topbar.module';
import { UserModule } from './user/user.module';
import { ToastsModule } from './toasts/toasts.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http, './assets/i18n/app/', '.json');

// export const WINDOW = new InjectionToken<Window>('An abstraction over global window object', {
//   factory: () => {
//     const { defaultView } = inject(DOCUMENT);

//     if (!defaultView) {
//       throw new Error('Window is not available');
//     }

//     return defaultView;
//   }
// });

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    BrowserAnimationsModule,
    SharedModule,
    // NgbModule,
    ToastsModule,
    // FontAwesomeModule,
    // LibertyIconsModule,
    UserModule,
    TopbarModule,
    // LoginModule,
    // ServerlogMonitorModule,
    // DevServerControlsModule,
    // ServiceWorkerModule.register('ngsw-worker.js', {
    //   enabled: AppConfig.production,
    //   // Register the ServiceWorker as soon as the app is stable
    //   // or after 30 seconds (whichever comes first).
    //   registrationStrategy: 'registerWhenStable:30000'
    // }),
    SocketIoModule.forRoot(socketConfig),
    // RouterModule,
    StoreModule.forRoot({
      router: routerReducer
    }, {}),
    // StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: AppConfig.production }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot()
  ],
  providers: [
    WebSocketService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
