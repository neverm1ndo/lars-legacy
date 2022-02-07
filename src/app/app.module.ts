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
import { AutofocusDirective } from './directives/autofocus.directive';
import { ServerStatGraphComponent } from './server-stat-graph/server-stat-graph.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [AppComponent, TopperComponent, AutofocusDirective, StatusPipe, ServerStatGraphComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    HomeModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    LibertyIconsModule,
    BrowserAnimationsModule,
    LoginModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
