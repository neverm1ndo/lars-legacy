import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeModule } from './home/home.module';

import { AppComponent } from './app.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LibertyIconsModule } from './liberty-icons/liberty-icons.module';

import { StatusPipe } from './pipes/status.pipe';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TopperComponent } from './topper/topper.component';
import { LoginModule } from './login/login.module';
import { ServerStatGraphComponent } from './server-stat-graph/server-stat-graph.component';
import { NgChartsModule } from 'ng2-charts';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppConfig } from '../environments/environment';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent, TopperComponent, StatusPipe, ServerStatGraphComponent],
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
    NgChartsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: AppConfig.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
