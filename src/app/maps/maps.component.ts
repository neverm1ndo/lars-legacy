import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { ElectronService } from '../core/services/electron/electron.service';
import { ToastService } from '../toast.service';
import { TreeNode } from '../interfaces/app.interfaces';
import { faMap, faPlus, faCubes, faDraftingCompass,
  faRoute, faCloudDownloadAlt, faCloudUploadAlt, faTrash,
  faCheckCircle, faInfo, faSave, faMapSigns, faArchway,
  faTimes, faRulerVertical } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FileTreeComponent } from '../file-tree/file-tree.component';
import { MapEditorComponent } from '../map-editor/map-editor.component';
import { mapload, panelSwitch, extrudeToRight } from '../app.animations';
import Keys from '../enums/keycode.enum';
import { MapObject } from '../interfaces/map.interfaces';

const { S, X } = Keys;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
  animations: [ mapload, panelSwitch, extrudeToRight ]
})
export class MapsComponent implements OnInit {

  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {
    if (this.current) {
      if (event.ctrlKey) {
        switch (event.keyCode) {
          case S : { // Ctrl + S
            this.saveMapLocal();
            break;
          }
          default : break;
        }
      }
      if (event.altKey) {
        switch (event.keyCode) {
          case X : { // Alt + X
            this.deleteMapCloud();
            break;
          }
          default : break;
        }
      }
    }
  }

  constructor(
    public api: ApiService,
    public route: ActivatedRoute,
    public electron: ElectronService,
    public toast: ToastService
   ) {
     this.directories$ = this.reloader$.pipe(switchMap(() => api.getMapsDir()));
     this.directories$.subscribe(items => {
       const expandIfExpandedBefore = (nodes: TreeNode) => {
         for (let item of nodes.items) {
           if (item.type == 'dir') {
             if (this.expanded.includes(item.path)) {
               item.expanded = true;
             }
             expandIfExpandedBefore(item);
           }
         }
         items = nodes;
       };
       expandIfExpandedBefore(items);
       this.files = items; this.current = null
     });
   }

   @ViewChild(FileTreeComponent) ftc: FileTreeComponent;
   @ViewChild(MapEditorComponent) mapEditor: MapEditorComponent;

  files: TreeNode;
  expanded: string[] = [];

  directories$: Observable<any>;
  reloader$: BehaviorSubject<any> = new BehaviorSubject(null);

  current: any;
  xml: string;
  currentFilePath: string;
  currentFileName: string;
  progress: number = 0;
  mapObjects: any;
  mode: 'view' | 'move' | 'rotate' = 'view';

  loading: boolean = false;
  levelingZ: boolean = false;

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

  chooseDir(dir: string) {
    if (this.expanded.includes(dir)) {
      this.expanded.splice(this.expanded.indexOf(dir), 1);
    } else {
      this.expanded.push(dir);
    }
  }

  toViewMode() {
    this.mode = 'view';
    this.levelingZ = false;
  }

  objectToMap(object: any[]): string {
    let res: string = '';
    for (let i = 0; i < object.length; i++) {
      Object.keys(object[i]).forEach((e: string, j: number) => {
        if (j === 0) {
          res += `<${object[i][e]} `
        }
        else { res += `${e}="${object[i][e]}" `};
        if (j === Object.keys(object[i]).length - 1) {
          res += `/>\n`;
        }
      });
    }
    return `<map edf:definitions="editor_main">\n` + res + `<!--\n LARS gta-liberty.ru \n-->\n` + '</map>';
  }

  mapToObject(xml: string): { objects: MapObject[]} {
    let parser = new DOMParser();
    const xmlfyRegex = new RegExp(' (edf:)(.*")');
    let map = parser.parseFromString(xml.replace(xmlfyRegex, ''), 'text/xml');
    let object: { objects: MapObject[]} = {
      objects: []
    };
    if (map.getElementsByTagName('map')[0]) {
      const elems = map.getElementsByTagName('map')[0].children;
      for (let i = 0; i < elems.length; i++) {
        const attrs = elems[i].attributes;
        let obj = { name: elems[i].tagName };
        for (let i = 0; i < attrs.length; i++) {
          const float = parseFloat(attrs[i].value);
          obj[attrs[i].name] = !isNaN(float) ? float : attrs[i].value;
        }
        if (obj.name !== 'parsererror') {
          object.objects.push(obj);
        }
      }
      return object;
    } else {
      this.toast.show(`Ошибка парсинга карты: MAP_PRS_ERR`,
        {
          classname: 'bg-danger text-light',
          delay: 5000,
          icon: faInfo,
          subtext: 'Отсутствует тег <map>'
         });
    }
  }
  async saveMapLocal() {
    return this.electron.dialog.showSaveDialog(
      {
        title: 'Сохранить карту как',
        buttonLabel: 'Сохранить',
        defaultPath: this.currentFileName,
        filters: [
          { name: 'Maps(*.map, *.off)', extensions: ['map', 'off'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      }).then(res => {
        if (res.filePath && !res.canceled) {
          this.electron.fs.writeFile(res.filePath, this.objectToMap(this.mapEditor._objects), 'utf8', (err) => {
            if (err) throw err;
          });
          this.mapEditor.changed = false;
          this.toast.show(`Карта <b>${ this.currentFileName }</b> успешно сохранена`,
            {
              classname: 'bg-success text-light',
              delay: 3000,
              icon: faSave,
              subtext: res.filePath
             });
        }
      }).catch( res => {
        this.toast.show(`<b>${ res.filePath }</b> не была сохранена`,
          {
            classname: 'bg-warning text-dark',
            delay: 5000,
            icon: faInfo,
            subtext: res.message
           });
      })
  }
  correctObjectsZLeveling(event: number) {
    const diff = event - this.mapEditor.getAverage('posZ');
    if (diff === 0) { this.levelingZ = false; return; }
    this.mapEditor.changePosZ(diff);
    this.toast.show(`Успешное изменение posZ`,
    {
      classname: 'bg-success text-light',
      delay: 5000,
      icon: faInfo
    });
    this.levelingZ = false;
  }
  levelZ() {
    this.levelingZ = true;
  }
  cancelChanges() {
    if (!this.mapEditor.changed) {
      this.toViewMode();
      return;
    }
    const dialogOpts = {
        type: 'warning',
        buttons: ['Да', 'Нет'],
        title: `Подтверждение отмены изменений`,
        message: `Есть несохраненные изменения в файле ${this.currentFilePath}. Отменить все изменения?`
      }
      if (this.mapEditor.changed) {
        this.electron.dialog.showMessageBox(dialogOpts).then(
          val => {
            if (val.response === 0) {
              this.toViewMode();
              this.current = this.mapToObject(this.xml);
              this.mapEditor.changed = false;
            }
          }
        )
      }
  }

  isChanged(): boolean {
    if (!this.mapEditor) return false;
    return this.mapEditor.changed || this.mode !== 'view';
  }
  getMap(path: { path: string, name?: string}): void {
    if (!this.isChanged()) {
      this.loading = true;
      this.currentFilePath = path.path;
      this.api.getMap(path.path).subscribe(map => {
        this.current = this.mapToObject(map);
        this.xml = map;
        this.currentFileName = path.name;
        this.loading = false;
      })
    } else {
      const dialogOpts = {
          type: 'warning',
          buttons: ['Да', 'Нет'],
          title: `Подтверждение отмены изменений`,
          message: `Есть несохраненные изменения в файле ${this.currentFilePath}. Сохранить изменения?`
        }
        this.electron.dialog.showMessageBox(dialogOpts).then(
          val => {
            if (val.response === 0) {
              return this.saveMapLocal()
            } else {
              return Promise.resolve();
            }
          }
        ).then(() => {
          this.reloadFileTree();
          this.api.getMap(path.path).subscribe(map => {
            this.current = this.mapToObject(map);
            this.xml = map;
            this.currentFileName = path.name;
          })
        }).finally(() => {
          this.toViewMode();
        });
    }
  }

  deleteMapCloud(): void {
    // let sub: any;
    const dialogOpts = {
        type: 'warning',
        buttons: ['Удалить', 'Отмена'],
        title: `Подтверждение удаления`,
        message: `Вы точно хотите удалить карту ${this.currentFilePath}? После подтверждения она будет безвозвратно удалена с сервера.`
      }
    this.electron.dialog.showMessageBox(dialogOpts).then(
      val => {
        if (val.response === 0) {
          /*sub =*/ this.api.deleteMap(this.currentFilePath).subscribe(() => {
            this.toast.show(`Карта <b>${ this.currentFileName }</b> удалена с сервера`,
              {
                classname: 'bg-success text-light',
                delay: 3000,
                icon: faTrash
              });
              this.reloadFileTree();
          });
        }
      }
    ).finally(() => {
      this.reloadFileTree();
      this.current = null;
    });
  }

  saveMapCloud(): void {
    const dialogOpts = {
        type: 'info',
        buttons: ['Сохранить', 'Отмена'],
        title: `Подтверждение сохранения на сервере`,
        message: `Вы точно хотите сохранить карту ${this.currentFilePath}? После подтверждения она будет перезаписана на сервере.`
      }
    this.electron.dialog.showMessageBox(dialogOpts).then(
      val => {
        if (val.response === 0) {
          const form = new FormData();
          const blob = new Blob([this.objectToMap(this.mapEditor._objects)], { type: 'text/plain' })
          form.append('file', blob, this.currentFilePath);
          /*sub =*/ this.api.uploadFileMap(form).subscribe(() => {}, () => {}, () => {
          this.toast.show(`Карта <b>${ this.currentFileName }</b> успешно перезаписана`,
            {
              classname: 'bg-success text-light',
              delay: 3000,
              icon: faSave,
              subtext: this.currentFilePath
            });
        });
        }
      }
    ).finally(() => {
      this.reloadFileTree();
    });
  }

  addNewMap(event: any): void {
    let files: any[];
    let path: string;
    if (event.filelist) { files = event.filelist; }
    else { files = event.target.files; }
       if (files.length > 0) {
         let formData: FormData = new FormData();
         if (event.path) {
           formData.append('path', event.path)
           path = event.path
         }
         for (let file of files) {
              formData.append('file', file);
         }
         this.api.uploadFileMap(formData).subscribe(
           event => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round(100 * event.loaded / event.total);
              } else if (event instanceof HttpResponse) {
                this.toast.show(`Карта <b>${ files[0].name }</b> успешно добавлена`, { classname: 'bg-success text-light', delay: 3000, icon: faSave });
                for (let file of files) {
                  this.api.addToRecent('upload', { path, name: file.name, type: 'map'})
                }
                this.reloadFileTree();
                setTimeout(() => { this.progress = 0; }, 1000)
                this.ftc.add.nativeElement.value = '';
              }
            },
            err => {
              this.progress = 0;
              this.toast.show(`Карта <b>${ files[0].name }</b> не была добавлена, или она добавилась, но сервер вернул ошибку`,
                {
                  classname: 'bg-warning text-dark',
                  delay: 5000,
                  icon: faInfo,
                  subtext: err.message
                 });
              console.error(err);
              this.reloadFileTree();
              this.ftc.add.nativeElement.value = '';
            });
    }
  }

  reloadFileTree(): void {
    this.reloader$.next(null);
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      filter(params => (params.name || params.path))
    ).subscribe(params => {
      this.currentFilePath = params.path;
      this.getMap({path: params.path, name: params.name});
    });
  }

}
