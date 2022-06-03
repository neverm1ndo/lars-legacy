import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { faMap, faPlus, faCubes, faDraftingCompass,
  faRoute, faCloudDownloadAlt, faCloudUploadAlt, faTrash,
  faCheckCircle, faInfo, faSave, faMapSigns, faArchway,
  faTimes, faRulerVertical, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Keys from '../../enums/keycode.enum';
import { EditorMode } from '../../enums/map.editor.enum';
import { MapObject } from '../../interfaces/map.interfaces';
import { MapEditorComponent } from '../map-editor/map-editor.component';
import { MapsService } from '../maps.service';
import { ActivatedRoute } from '@angular/router';
import { tap, switchMap, filter } from 'rxjs/operators';
import { mapload, panelSwitch, extrudeToRight } from '../../app.animations';

const { S, X } = Keys;

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
    sign: faMapSigns,
    cubes: faCubes,
    replace: faRoute,
    rotate: faDraftingCompass,
    arch: faArchway,
    cross: faTimes,
    ruler: {
      vert: faRulerVertical,
    }
  }
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
        switch (event.keyCode) {
          case S : { // Ctrl + S
            this.maps.saveMapLocal(this.current.name, this.mapEditor.objects);
            break;
          }
          default : break;
        }
      }
      if (event.altKey) {
        switch (event.keyCode) {
          case X : { // Alt + X
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
    if (!this.mapEditor.changed) {
      this.toViewMode();
      return;
    }
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

  saveMapCloud() {
    this.maps.saveMapCloud(this.current.path, this.mapEditor.objects).subscribe(() => {
      this.maps.mapToast(`Карта ${this.current.name} сохранена на сервере`, this.current.path, faCloudUploadAlt, 'bg-success text-light')
    },
    (err) => { this.maps.mapToast(`Карта ${this.current.name} не сохранена`, err.message, faExclamationTriangle, 'bg-danger text-light') })
  }
  saveMapLocal() {
    this.maps.saveMapLocal(this.current.name, this.mapEditor.objects).subscribe((filePath: string) => {
      this.maps.mapToast(`Карта ${this.current.name} сохранена на локальном диске`, filePath, faCloudDownloadAlt, 'bg-success text-light')
    },
    (err) => { this.maps.mapToast(`Карта ${this.current.name} не сохранена`, err.message, faExclamationTriangle, 'bg-danger text-light') })
  }

  deleteMapCloud() {
    this.maps.deleteMapCloud(this.current.path).subscribe(() => {
      this.maps.mapToast(`Карта ${this.current.name} была удалена с сервера`, this.current.path, faTrash, 'bg-success text-light')
    },
    (err) => {
      console.log(err)
      this.maps.mapToast(`Карта ${this.current.name} не была удалена`, err.message, faExclamationTriangle, 'bg-danger text-light')
    })
  }


  ngOnInit(): void {
    // this.route.queryParams
    // .pipe(filter((params) => params.path && params.name))
    // .pipe(tap(params => {
    //   this.loading = true;
    //   this.current = {
    //     path: params.path,
    //     name: params.name,
    //     objects: []
    //   };
    //   return params
    // }))
    // .pipe(switchMap(params => this.maps.getMap({path: params.path, name: params.name })))
    // .subscribe((file: MapObject[]) => {
    //   this.mapEditor.objects = file;
    //   this.current.objects = file;
    //   this.loading = false;
    // }, (err) => {
    //   console.error(err)
    //   this.maps.mapNotLoaded(err);
    // });
  }
}
