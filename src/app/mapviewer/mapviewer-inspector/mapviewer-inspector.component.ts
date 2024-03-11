import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { faBoxes, faCube } from '@fortawesome/free-solid-svg-icons';
import { MapViewerFacade } from '../domain/application/mapviewer.facade';
import { take } from 'rxjs';

@Component({
  selector: 'lars-mapviewer-inspector',
  templateUrl: './mapviewer-inspector.component.html',
  styleUrls: ['./mapviewer-inspector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapViewerInspectorComponent implements OnInit {
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

  hide() {
    //TODO: implement pane hide
  }

  selectObject(index: number) {
    this.mapViewerFacade.setSelectedObjectIndex(index);
  } 

  openInTextEditor() {
      this.mapViewerFacade.getCurrentFilePathName()
      .pipe(take(1))
      .subscribe(({ path, name }) => {
        window.open(`/home/configs/doc?frame=1&path=${path}&name=${name}`, 'monitor', 'minWidth=950');
      });
  }


  ngOnInit(): void {
  }

}
