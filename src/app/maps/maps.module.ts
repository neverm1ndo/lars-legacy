import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapsRoutingModule } from './maps-routing.module';
import { LtyFileTreeModule } from '@lars/shared/lty-file-tree/lty-file-tree.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LibertyIconsModule } from '../liberty-icons/liberty-icons.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSplitModule } from 'angular-split';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MapsComponent } from './containers/layout/maps.component';
import { MapInspectorComponent } from './components/map-inspector/map-inspector.component';
import { MapEditorComponent } from './components/map-editor/map-editor.component';
import { MapComponent } from './components/map-view/map-view.component';
import { MapCorrectorComponent } from './components/map-corrector/map-corrector.component';
import { MapsService } from './domain/infrastructure/maps.service';
import { MapEditorV2Component } from './components/map-editor-v2/map-editor-v2.component';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { SharedModule } from '@lars/shared/shared.module';

@NgModule({
  declarations: [MapsComponent, MapInspectorComponent, MapEditorComponent, MapCorrectorComponent, MapComponent, MapEditorV2Component],
  imports: [
    CommonModule,
    ScrollingModule,
    MapsRoutingModule,
    LtyFileTreeModule,
    FontAwesomeModule,
    LibertyIconsModule,
    NgbModule,
    AngularSplitModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [MapsService]
})
export class MapsModule { }
