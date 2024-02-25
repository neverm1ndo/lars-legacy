import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { NgSelectModule } from '@ng-select/ng-select';
import { SocketIoModule } from 'ngx-socket-io';
import { LtyFileTreeModule } from '../shared/lty-file-tree/lty-file-tree.module';

import { HomeRoutingModule } from './home-routing.module';

import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { JWTInterceptor } from '../api/interceptors/jwt.interceptor';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SiderComponent } from './sider/sider.component';
import { SearchComponent } from './search/search.component';
import { SharedModule } from '../shared/shared.module';
import { LibertyIconsModule } from '../liberty-icons/liberty-icons.module';
import { AuthGuard } from '../guards/auth.guard';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchEditorComponent } from './search-editor/search-editor.component';
import { GeoComponent } from './geo/geo.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BanhammerComponent } from '../bans/containers/banhammer/banhammer.component';
import { LoglineContentComponent } from '../logline-content/logline-content.component';

import { AdminsComponent } from './admins/admins.component';

import { NotificationsService } from '../notifications/notifications.service';
import { UserActionPipe } from '../shared/pipes/user-action.pipe';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { UserModule } from '@lars/user/user.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

// const idbConfig: DBConfig  = {
//   name: 'users',
//   version: 1,
//   objectStoresMeta: [{
//     store: 'user',
//     storeConfig: { keyPath: 'id', autoIncrement: true },
//     storeSchema: [
//       { name: 'id', keypath: 'id', options: { unique: true } },
//       { name: 'username', keypath: 'username', options: { unique: false } },
//       { name: 'avatar', keypath: 'avatar', options: { unique: false } },
//       { name: 'main_group', keypath: 'main_group', options: { unique: false } },
//       { name: 'secondary_group', keypath: 'secondary_group', options: { unique: false } },
//     ],
//   }],
// };

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/home/', '.json');
}

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    SiderComponent,
    SearchComponent,
    SearchEditorComponent,
    GeoComponent,
    AdminsComponent,
    LoglineContentComponent,
    UserActionPipe
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    FormsModule,
    NgbModule,
    // HttpClientModule,
    // UserModule,
    LibertyIconsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    // NgxIndexedDBModule.forRoot(idbConfig),
    NgSelectModule,
    LtyFileTreeModule,
    ScrollingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [NotificationsService]
})
export class HomeModule {}
