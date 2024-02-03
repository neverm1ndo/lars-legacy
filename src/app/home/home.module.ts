import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { NgSelectModule } from '@ng-select/ng-select';
import { SocketIoModule } from 'ngx-socket-io';
import { LtyFileTreeModule } from '../shared/lty-file-tree/lty-file-tree.module';

import { HomeRoutingModule } from './home-routing.module';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JWTInterceptor } from '../api/interceptors/jwt.interceptor';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SiderComponent } from './sider/sider.component';
import { SharedModule } from '../shared/shared.module';
import { LibertyIconsModule } from '../liberty-icons/liberty-icons.module';
import { AuthGuard } from '../guards/auth.guard';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BanhammerComponent } from './banhammer/banhammer.component';

import { AdminsComponent } from './admins/admins.component';

import { socketConfig } from '../ws/web-socket.service';

import { NotificationsService } from '../notifications/notifications.service';
import { UserActionPipe } from '../shared/pipes/user-action.pipe';

const idbConfig: DBConfig = {
  name: 'users',
  version: 1,
  objectStoresMeta: [
    {
      store: 'user',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: true } },
        { name: 'username', keypath: 'username', options: { unique: false } },
        { name: 'avatar', keypath: 'avatar', options: { unique: false } },
        {
          name: 'main_group',
          keypath: 'main_group',
          options: { unique: false }
        },
        {
          name: 'secondary_group',
          keypath: 'secondary_group',
          options: { unique: false }
        }
      ]
    }
  ]
};

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    SiderComponent,
    BanhammerComponent,
    AdminsComponent,
    UserActionPipe
    UserActionPipe
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    LibertyIconsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgxIndexedDBModule.forRoot(idbConfig),
    SocketIoModule.forRoot(socketConfig),
    NgSelectModule,
    LtyFileTreeModule
  ],
  providers: [
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
