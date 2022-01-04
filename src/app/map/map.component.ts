import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { faMap, faPlus, faCubes, faDraftingCompass,
  faRoute, faCloudDownloadAlt, faCloudUploadAlt, faTrash,
  faCheckCircle, faInfo, faSave, faMapSigns, faArchway,
  faTimes, faRulerVertical } from '@fortawesome/free-solid-svg-icons';
import Keys from '../enums/keycode.enum';
import { MapObject } from '../interfaces/map.interfaces';
import { MapEditorComponent } from '../map-editor/map-editor.component';
import { MapsService } from '../maps.service';
import { ActivatedRoute } from '@angular/router';
import { tap, switchMap, filter } from 'rxjs/operators';
import { mapload, panelSwitch, extrudeToRight } from '../app.animations';

const { S, X } = Keys;

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
  mode: 'view' | 'move' | 'rotate' = 'view';
  xml: string;
  loading: boolean = false;
  levelingZ: boolean = false;
  current = {
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

  toViewMode() {
    this.mode = 'view';
    this.levelingZ = false;
  }

  isChanged(): boolean {
    if (!this.mapEditor) return false;
    return this.mapEditor.changed || this.mode !== 'view';
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
      this.toViewMode();
      this.mapEditor.changed = false;
    })
    .catch(() => {
      console.log('Cancelling rejected by user')
    })
  }


  ngOnInit(): void {
    this.route.queryParams
    .pipe(filter((params) => params.path && params.name))
    .pipe(tap(params => {
      this.loading = true;
      this.current = {
        path: params.path,
        name: params.name,
        objects: []
      };
      console.log(params)
      return params
    }))
    .pipe(switchMap(params => this.maps.getMap({path: params.path, name: params.name })))
    .subscribe((file: MapObject[]) => {
      console.log(file)
      this.mapEditor.objects = file;
      this.current.objects = file;
      this.loading = false;
    }, (err) => {
      // this.toast.show(`Конфигурационный файл не был загружен по причине:`, {
      //   classname: 'bg-danger text-light',
      //   delay: 6000,
      //   icon: faExclamationTriangle,
      //   subtext: `${err.status} ${err.statusText}`
      // });
    });
  }

}
