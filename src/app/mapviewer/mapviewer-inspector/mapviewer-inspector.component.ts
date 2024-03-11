import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { faBoxes } from '@fortawesome/free-solid-svg-icons';
import { MapViewerFacade } from '../domain/application/mapviewer.facade';
import { ActivatedRoute } from '@angular/router';
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
  };

  objects$ = this.mapViewerFacade.getCurrentMapObjects();

  constructor(
    private readonly mapViewerFacade: MapViewerFacade,
  ) { }

  isObject(name: string): boolean {
    return name !== 'material' && name !== 'text';
  }

  openInTextEditor() {
      this.mapViewerFacade.getCurrentFilePathName()
      .pipe(take(1))
      .subscribe(({ path, name }) => {
        window.open(`/home/maps/xmleditor?frame=1&path=${path}&name=${name}`, 'monitor', 'minWidth=950');
      });
  }


  ngOnInit(): void {
  }

}
