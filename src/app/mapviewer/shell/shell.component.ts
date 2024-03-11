import { Component, OnInit } from '@angular/core';
import { IOutputAreaSizes } from 'angular-split';
import { BehaviorSubject } from 'rxjs';
import { MapViewerFacade } from '../domain/application/mapviewer.facade';
import { Router } from '@angular/router';

@Component({
  selector: 'lars-mapviewer-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  constructor(
    private readonly mapViewerFacade: MapViewerFacade,
    private router: Router
  ) { }

  public panes = ['horizontal', 'vertical'].map((direction) => this.setPanesState(direction));

  public progress$ = new BehaviorSubject<number>(0);

  public fileTree$ = this.mapViewerFacade.getFileTree();

  // TODO: перенести управление панелями в отдельный сервис
  private setPanesState(direction: string): number[] {
    try {
      const states = JSON.parse(window.localStorage.getItem('lars/ui/panes/maps/' + direction));
      if (!states) throw 'undefined panes state';
      return states;
    } catch(err) {
      console.error(err);
      return [20, 80];
    }
  }
  
  // TODO: перенести управление панелями в отдельный сервис
  savePanesState(event: { gutterNum: number | '*', sizes: IOutputAreaSizes }, direction: string): void {
    window.localStorage.setItem('lars/ui/panes/maps/' + direction, JSON.stringify(event.sizes));
  }


  openMapFile({ path, name }: { path: string; name?: string }) {
    this.router.navigate(['/home/maps/flat'], { queryParams: { path, name }});
  }


  ngOnInit(): void {
  }

}
