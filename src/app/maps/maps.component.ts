import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { ElectronService } from '../core/services/electron/electron.service';
import { ToastService } from '../toast.service';
import { TreeNode } from '../interfaces/app.interfaces';
import { faMap, faPlus, faCubes, faDraftingCompass, faRoute, faCloudDownloadAlt, faCloudUploadAlt, faTrash, faCheckCircle, faInfo, faSave, faMapSigns } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FileTreeComponent } from '../file-tree/file-tree.component';
import { mapload } from '../app.animations';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
  animations: [ mapload ]
})
export class MapsComponent implements OnInit {

  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {
    if (this.current) {
      if (event.ctrlKey) {
        switch (event.keyCode) {
          case 83 : { // Ctrl + S
            this.saveMapLocal();
            break;
          }
          default : break;
        }
      }
      if (event.altKey) {
        switch (event.keyCode) {
          case 88 : { // Alt + X
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

  files: TreeNode;
  expanded: string[] = [];

  directories$: Observable<any>;
  reloader$: BehaviorSubject<any> = new BehaviorSubject(null);

  current: any;
  xml: string;
  currentFilePath: string;
  progress: number = 0;
  mapObjects: any;
  mode: 'view' | 'move' | 'rotate' = 'view';

  loading: boolean = false;

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
    rotate: faDraftingCompass
  }

  chooseDir(dir: string) {
    if (this.expanded.includes(dir)) {
      this.expanded.splice(this.expanded.indexOf(dir), 1);
    } else {
      this.expanded.push(dir);
    }
  }

  mapToObject(xml: string) {
    let parser = new DOMParser();
    const xmlfyRegex = new RegExp(' (edf:)(.*")');
    let map = parser.parseFromString(xml.replace(xmlfyRegex, ''), 'text/xml');
    let object: { objects: any[]} = {
      objects: []
    };
    const elems = map.getElementsByTagName('map')[0].children;
    for (let i = 0; i < elems.length; i++) {
      const attrs = elems[i].attributes;
      let obj = { name: elems[i].tagName };
      for (let i = 0; i < attrs.length; i++) {
        obj[attrs[i].name] = attrs[i].value;
      }
      if (obj.name !== 'parsererror') {
        object.objects.push(obj);
      }
    }
    return object;
  }

  saveMapLocal(): void {
    this.electron.dialog.showSaveDialog(
      {
        title: 'Сохранить карту как',
        buttonLabel: 'Сохранить',
        defaultPath: this.current.name,
        filters: [
          { name: 'Maps(*.map, *.off)', extensions: ['map', 'off'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      }).then(res => {
        if (res.filePath && !res.canceled) {
          this.electron.fs.writeFile(res.filePath, this.xml, 'utf8', (err) => {
            if (err) throw err;
          });
          this.toast.show(`Карта <b>${ this.current.name }</b> успешно сохранена`,
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
        console.error(res);
      })
  }

  getMap(path: { path: string, name?: string}) {
    this.currentFilePath = path.path;
    this.api.getMap(path.path).subscribe(map => {
      this.current = this.mapToObject(map);
      this.xml = map;
      this.current.name = path.name;
      this.api.loading = false;
    })
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
            this.toast.show(`Карта <b>${ this.current.name }</b> удалена с сервера`,
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

  saveMapCloud(): void {}

  addNewMap(event: any): void {
    let files: any[];
    if (event.filelist) { files = event.filelist; }
    else { files = event.target.files; }
       if (files.length > 0) {
         let formData: FormData = new FormData();
         if (event.path) {
           formData.append('path', event.path)
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
      console.log(params);
      this.currentFilePath = params.path;
      this.getMap({path: params.path, name: params.name});
    });
  }

}
