import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { faMap, faPlus, faCubes, faDraftingCompass,
  faRoute, faCloudDownloadAlt, faCloudUploadAlt, faTrash,
  faCheckCircle, faInfo, faSave, faArchway,
  faTimes, faRulerVertical, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { EditorMode } from '@lars/enums/map.editor.enum';
import { MapObject } from '../map.interfaces';
import { MapEditorComponent } from '../map-editor/map-editor.component';
import { MapsService } from '../maps.service';
import { ActivatedRoute } from '@angular/router';
import { tap, switchMap, filter } from 'rxjs/operators';
import { mapload, panelSwitch, extrudeToRight } from '@lars/app.animations';

interface CurrentMap {
  name: string,
  path: string,
  objects: MapObject[]
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  animations: [ mapload, panelSwitch, extrudeToRight ]
})
export class MapComponent implements OnInit {

  fa = {
    map: faMap,
    plus: faPlus,
    down: faCloudDownloadAlt,
    up: faCloudUploadAlt,
    trash: faTrash,
    check: faCheckCircle,
    info: faInfo,
    save: faSave,
    cubes: faCubes,
    replace: faRoute,
    rotate: faDraftingCompass,
    arch: faArchway,
    cross: faTimes,
    ruler: {
      vert: faRulerVertical,
    }
  }

  public paneStates: number[] = [];

  mode: EditorMode = EditorMode.VIEW;
  loading: boolean = false;
  levelingZ: boolean = false;

  current: CurrentMap = {
    path: '',
    name: '',
    objects: []
  }

  @ViewChild(MapEditorComponent) mapEditor: MapEditorComponent;
  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {
    if (this.current) {
      if (event.ctrlKey) {
        switch (event.key) {
          case 's' : { // Ctrl + S
            this.maps.saveMapLocal(this.current.name, this.mapEditor.objects);
            break;
          }
          default : break;
        }
      }
      if (event.altKey) {
        switch (event.key) {
          case 'x' : { // Alt + X
            this.maps.deleteMapCloud(this.current.path);
            break;
          }
          default : break;
        }
      }
    }
  }

  constructor(
    private maps: MapsService,
    private route: ActivatedRoute,
  ) { }

  isViewMode(): boolean {
    return this.mode === EditorMode.VIEW;
  }
  toViewMode() {
    this.mode = this.mapEditor.mode = EditorMode.VIEW;
    this.levelingZ = false;
  }
  toRotateMode() {
    this.mode = this.mapEditor.mode = EditorMode.ROTATE;
  }
  toMoveMode() {
    this.mode = this.mapEditor.mode = EditorMode.MOVE;
  }

  isChanged(): boolean {
    if (!this.mapEditor) return false;
    return this.mapEditor.changed || this.mode !== EditorMode.VIEW;
  }

  correctObjectsZLeveling(event: number) {
    const diff = event - this.mapEditor.getAverage('posZ');
    if (diff === 0) { this.levelingZ = false; return; }
    this.mapEditor.changePosZ(diff);
    this.maps.posZChangeSuccess();
    this.levelingZ = false;
  }
  levelZ() {
    this.levelingZ = this.levelingZ? false : true;
  }
  cancelChanges() {
    if (!this.mapEditor.changed) return void (this.toViewMode());
    this.maps.cancelChanges(this.current.path)
             .then(() => {
                this.mapEditor.objects = this.current.objects;
                this.mapEditor.changed = false;
                this.toViewMode();
             })
             .catch(() => {
                console.log('Cancelling rejected by user')
             })
  }

  public saveMapCloud() {
    this.maps.saveMapCloud(this.current.path, this.mapEditor.objects)
             .subscribe({
                next: () => { 
                  this.maps.mapToast(`Карта ${this.current.name} сохранена на сервере`, this.current.path, faCloudUploadAlt, 'bg-success text-light')
                },
                error: (err) => { 
                  this.maps.mapToast(`Карта ${this.current.name} не сохранена`, err.message, faExclamationTriangle, 'bg-danger text-light') 
                }
              })
  }
  public saveMapLocal() {
    this.maps.saveMapLocal(this.current.name, this.mapEditor.objects)
             .subscribe({
                next: (filePath: string) => {
                  this.maps.mapToast(`Карта ${this.current.name} сохранена на локальном диске`, filePath, faCloudDownloadAlt, 'bg-success text-light')
                },
                error: (err) => { 
                  this.maps.mapToast(`Карта ${this.current.name} не сохранена`, err.message, faExclamationTriangle, 'bg-danger text-light') 
                }
              });
  }

  public deleteMapCloud() {
    this.maps.deleteMapCloud(this.current.path)
             .subscribe({
                next: () => {
                  this.maps.mapToast(`Карта ${this.current.name} была удалена с сервера`, this.current.path, faTrash, 'bg-success text-light')
                },
                error: (err) => {
                  console.log(err);
                  this.maps.mapToast(`Карта ${this.current.name} не была удалена`, err.message, faExclamationTriangle, 'bg-danger text-light')
                }
              });
  }


  ngOnInit(): void {
    this.route.queryParams
    .pipe(
      filter(({ path, name }) => path && name),
      tap(({ path, name }) => {
        this.loading = true;
        this.current = {
          path,
          name,
          objects: []
        };
        return { path, name };
      }),
      switchMap(({ path, name }) => this.maps.getMap({ path, name }))
    )
    .subscribe({
      next: (file: MapObject[]) => {
        this.mapEditor.objects = file;
        this.current.objects = file;
        this.loading = false;
      }, 
      error: (err) => {
        console.error(err)
        this.maps.mapNotLoaded(err);
      }
    });
  }
}
