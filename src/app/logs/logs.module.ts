import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogsRoutingModule } from './logs-routing.module';
import { SharedModule } from '@lars/shared/shared.module';
import { LogsListComponent } from './containers/logs-list/logs-list.component';
import { LogsListItemComponent } from './containers/logs-list-item/logs-list-item.component';
import { LogsComponent } from './containers/logs/logs.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { LogsDomainModule } from './domain/logs-domain.module';
import { UserDomainModule } from '@lars/user/domain/user-domain.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { GeoComponent } from './components/content/geo/geo.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoglineContentComponent } from './containers/logline-content/logline-content.component';
import { LibertyIconsModule } from '@lars/liberty-icons/liberty-icons.module';
import { LazyLoadDirective } from './lazy-load/lazy-load.directive';
import { DefaultLogLineContentComponent } from './components/content/default/default.component';
import { AuthLoglineContentComponent } from './components/content/auth-logline-content/auth-logline-content.component';
import { DeathLoglineContentComponent } from './components/content/death-logline-content/death-logline-content.component';
import { TargetLoglineContentComponent } from './components/content/target-logline-content/target-logline-content.component';
import { PropsLoglineContentComponent } from './components/content/props-logline-content/props-logline-content.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { FilterModule } from '@lars/filter/filter.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/logs/', '.json');
}

@NgModule({
  declarations: [
    LogsListComponent,
    LogsListItemComponent,
    LogsComponent,
    LoglineContentComponent,
    GeoComponent,
    LazyLoadDirective,
    DefaultLogLineContentComponent,
    AuthLoglineContentComponent,
    DeathLoglineContentComponent,
    TargetLoglineContentComponent,
    PropsLoglineContentComponent
  ],
  imports: [
    CommonModule,
    LogsRoutingModule,
    SharedModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    NgbModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    }),
    LogsDomainModule,
    UserDomainModule,
    LibertyIconsModule,
    FilterModule
  ]
})
export class LogsModule {}
