import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { MapViewerFacade } from '../domain/application/mapviewer.facade';

@Component({
  selector: 'lars-mapviewer-bar',
  templateUrl: './map-viewer-bar.component.html',
  styleUrls: ['./map-viewer-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapViewerBarComponent implements OnInit {

  fa = {
    faMap
  }

  constructor(
    private readonly mapViewerFacade: MapViewerFacade
  ) { }

  openInTextEditor(): void {
    this.mapViewerFacade.openInTextEditor();
  }

  saveLocally(): void {
    this.mapViewerFacade.saveFileLocally();
  }

  saveInCloud(): void {
    this.mapViewerFacade.saveFileOnServer();
  }

  deleteFile(): void {
    this.mapViewerFacade.deleteMapFromServer();
  }

  ngOnInit(): void {
  }

}
