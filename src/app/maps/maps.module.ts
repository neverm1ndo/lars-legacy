import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapsRoutingModule } from './maps-routing.module';
import { LtyFileTreeModule } from '../lty-file-tree/lty-file-tree.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LibertyIconsModule } from '../liberty-icons/liberty-icons.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MapsComponent } from './maps.component';
import { MapInspectorComponent } from './map-inspector/map-inspector.component';
import { MapEditorComponent } from './map-editor/map-editor.component';
import { MapComponent } from './map/map.component';
import { MapCorrectorComponent } from './map-corrector/map-corrector.component';
import { MapsService } from './maps.service';

@NgModule({
  declarations: [MapsComponent, MapInspectorComponent, MapEditorComponent, MapCorrectorComponent, MapComponent],
  imports: [
    CommonModule,
    MapsRoutingModule,
    LtyFileTreeModule,
    FontAwesomeModule,
    LibertyIconsModule,
    NgbModule,
  ],
  providers: [MapsService]
})
export class MapsModule { }
