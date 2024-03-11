import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapViewerRoutingModule } from './mapviewer-routing.module';
import { ShellComponent } from './shell/shell.component';
import { LtyFileTreeModule } from '@lars/shared/lty-file-tree/lty-file-tree.module';
import { MapViewerDomainModule } from './domain/mapviewer-domain.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSplitModule } from 'angular-split';
import { Flat2dmapComponent } from './flat2dmap/flat2dmap.component';
import { LibertyIconsModule } from '@lars/liberty-icons/liberty-icons.module';
import { MapViewerInspectorComponent } from './mapviewer-inspector/mapviewer-inspector.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConfigsModule } from '@lars/configs/configs.module';


@NgModule({
  declarations: [
    ShellComponent,
    Flat2dmapComponent,
    MapViewerInspectorComponent
  ],
  imports: [
    CommonModule,
    MapViewerRoutingModule,
    MapViewerDomainModule,
    LtyFileTreeModule,
    LibertyIconsModule,
    FontAwesomeModule,
    NgbModule,
    AngularSplitModule,
    ScrollingModule,
    ConfigsModule
  ]
})
export class MapViewerModule { }
