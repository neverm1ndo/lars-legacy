import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSplitModule } from 'angular-split';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MapViewerDomainModule } from './domain/mapviewer-domain.module';
import { MapViewerRoutingModule } from './mapviewer-routing.module';
import { ShellComponent } from './shell/shell.component';
import { LtyFileTreeModule } from '@lars/shared/lty-file-tree/lty-file-tree.module';
import { Flat2dmapComponent } from './flat2dmap/flat2dmap.component';
import { LibertyIconsModule } from '@lars/liberty-icons/liberty-icons.module';
import { MapViewerInspectorComponent } from './mapviewer-inspector/mapviewer-inspector.component';
import { MapViewerBarComponent } from './map-viewer-bar/map-viewer-bar.component';
import { DocumentTipsComponent } from '@lars/shared/components/document-tips/document-tips.component';

@NgModule({
  declarations: [
    ShellComponent,
    Flat2dmapComponent,
    MapViewerInspectorComponent,
    MapViewerBarComponent
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
    DocumentTipsComponent
  ]
})
export class MapViewerModule {}
