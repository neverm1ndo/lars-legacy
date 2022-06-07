import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { NgSelectModule } from '@ng-select/ng-select';
import { SocketIoModule } from 'ngx-socket-io';
import { NgChartsModule } from 'ng2-charts';
import { LtyFileTreeModule } from '../lty-file-tree/lty-file-tree.module';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SiderComponent } from './sider/sider.component';
import { SearchComponent } from './search/search.component';
import { SharedModule } from '../shared/shared.module';
import { LibertyIconsModule } from '../liberty-icons/liberty-icons.module';
import { AuthGuard } from '../guards/auth.guard';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { SearchEditorComponent } from '../search-editor/search-editor.component';
// import { ConfigEditorComponent } from '../config-editor/config-editor.component';
import { LineProcessComponent } from '../line-process/line-process.component';
import { GeoComponent } from '../geo/geo.component';
import { FilterComponent } from '../filter/filter.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JWTInterceptor } from '../interceptors/jwt.interceptor';
// import { TextEditorComponent } from '../text-editor/text-editor.component';
import { ToastsContainer } from '../toasts-container/toasts-container.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SettingsComponent } from '../settings/settings.component';
import { BanhammerComponent } from '../banhammer/banhammer.component';
import { LoglineContentComponent } from '../logline-content/logline-content.component';
import { SimpleLineProcessComponent } from '../simple-line-process/simple-line-process.component';

import { AdminsComponent } from '../admins/admins.component';
import { BackupsComponent } from '../backups/backups.component';
import { BackupItemComponent } from '../backup-item/backup-item.component';
import { NotificationsSettingsComponent } from '../notifications-settings/notifications-settings.component';
import { GeneralSettingsComponent } from '../general-settings/general-settings.component';

import { socketConfig } from '../web-socket.service';
// import { EmptyDocComponent } from '../empty-doc/empty-doc.component';
// import { BinaryDocComponent } from '../binary-doc/binary-doc.component';

import { LauncherSettingsComponent } from '../launcher-settings/launcher-settings.component';
import { StatisticsComponent } from '../statistics/statistics.component';

import { RulesPipe } from '../pipes/rules.pipe';
import { RolePipe } from '../pipes/role.pipe';

// import { ConfigsService } from '../configs.service';
import { NotificationsService } from '../notifications.service';
import { UserActionPipe } from '../pipes/user-action.pipe';

const dbConfig: DBConfig  = {
  name: 'lty_users',
  version: 1,
  objectStoresMeta: [{
    store: 'user',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'name', keypath: 'name', options: { unique: false } },
      { name: 'avatar', keypath: 'avatar', options: { unique: false } },
      { name: 'id', keypath: 'id', options: { unique: true } },
      { name: 'group', keypath: 'group', options: { unique: false } },
    ],
  }],
};

@NgModule({
  declarations: [HomeComponent, DashboardComponent, SiderComponent, SearchComponent, SearchResultsComponent, SearchEditorComponent, LineProcessComponent, GeoComponent, FilterComponent, ToastsContainer, SettingsComponent, BanhammerComponent, LoglineContentComponent, SimpleLineProcessComponent, AdminsComponent, BackupsComponent, BackupItemComponent, NotificationsSettingsComponent, GeneralSettingsComponent, LauncherSettingsComponent, RulesPipe, RolePipe, StatisticsComponent, UserActionPipe],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    LibertyIconsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    SocketIoModule.forRoot(socketConfig),
    NgSelectModule,
    NgChartsModule,
    LtyFileTreeModule
  ],
  providers: [
    // ConfigsService,
    NotificationsService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTInterceptor,
      multi: true
    }
  ]
})
export class HomeModule {}
