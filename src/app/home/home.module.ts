import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeadComponent } from './head/head.component';
import { SiderComponent } from './sider/sider.component';
import { SearchComponent } from './search/search.component';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../guards/auth.guard';
import { Processes } from '../line-process/log-processes';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { SearchEditorComponent } from '../search-editor/search-editor.component';
import { ConfigEditorComponent } from '../config-editor/config-editor.component';
import { LineProcessComponent } from '../line-process/line-process.component';
import { GeoComponent } from '../geo/geo.component';
import { FilterComponent } from '../filter/filter.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JWTInterceptor } from '../interceptors/jwt.interceptor';
import { FileTreeComponent } from '../file-tree/file-tree.component';

@NgModule({
  declarations: [HomeComponent, DashboardComponent, HeadComponent, SiderComponent, SearchComponent, SearchResultsComponent, SearchEditorComponent, ConfigEditorComponent, LineProcessComponent, GeoComponent, FilterComponent, FileTreeComponent],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  providers: [
    AuthGuard,
    Processes,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTInterceptor,
      multi: true
    }
  ]
})
export class HomeModule {}
