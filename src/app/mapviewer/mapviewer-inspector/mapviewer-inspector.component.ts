import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faBoxes, faCube } from '@fortawesome/free-solid-svg-icons';
import { MapViewerFacade } from '../domain/application/mapviewer.facade';

@Component({
  selector: 'lars-mapviewer-inspector',
  templateUrl: './mapviewer-inspector.component.html',
  styleUrls: ['./mapviewer-inspector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapViewerInspectorComponent {
  fa = {
    faBoxes,
    faCube
  };

  objects$ = this.mapViewerFacade.getCurrentMapObjects();

  selectedObjectIndex$ = this.mapViewerFacade.getSelectedObjectIndex();

  constructor(
    private readonly mapViewerFacade: MapViewerFacade,
  ) { }

  isObject(name: string): boolean {
    return name !== 'material' && name !== 'text';
  }

  selectObject(index: number) {
    this.mapViewerFacade.setSelectedObjectIndex(index);
  } 
}
