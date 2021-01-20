import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SiderComponent } from './sider/sider.component';
import { SearchComponent } from './search/search.component';
import { SharedModule } from '../shared/shared.module';
import { LibertyIconsModule } from '../libery-icons/liberty-icons.module';
import { AuthGuard } from '../guards/auth.guard';
import { Processes } from '../line-process/log-processes';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { SearchEditorComponent } from '../search-editor/search-editor.component';
import { ConfigEditorComponent } from '../config-editor/config-editor.component';
import { LineProcessComponent } from '../line-process/line-process.component';
import { GeoComponent } from '../geo/geo.component';
import { FilterComponent } from '../filter/filter.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JWTInterceptor } from '../interceptors/jwt.interceptor';
import { FileTreeComponent } from '../file-tree/file-tree.component';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { FileTreeItemComponent } from '../file-tree-item/file-tree-item.component';
import { FileTreeItemsComponent } from '../file-tree-items/file-tree-items.component';
import { ToastsContainer } from '../toasts-container/toasts-container.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SettingsComponent } from '../settings/settings.component';
import { MapsComponent } from '../maps/maps.component';
import { MapInspectorComponent } from '../map-inspector/map-inspector.component';
import { MapEditorComponent } from '../map-editor/map-editor.component';
import { BanhammerComponent } from '../banhammer/banhammer.component';

@NgModule({
  declarations: [HomeComponent, DashboardComponent, SiderComponent, SearchComponent, SearchResultsComponent, SearchEditorComponent, ConfigEditorComponent, LineProcessComponent, GeoComponent, FilterComponent, FileTreeComponent, TextEditorComponent, FileTreeItemComponent, FileTreeItemsComponent, ToastsContainer, SettingsComponent, MapsComponent, MapInspectorComponent, MapEditorComponent, BanhammerComponent],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    LibertyIconsModule,
    CodemirrorModule,
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
