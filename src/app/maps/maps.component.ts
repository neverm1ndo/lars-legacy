import { Component, OnInit, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { ApiService } from '../api.service';
import { ElectronService } from '../core/services/electron/electron.service';
import { ToastService } from '../toast.service';
import { TreeNode } from '../interfaces/app.interfaces';
import { faMap, faPlus, faCloudDownloadAlt, faCloudUploadAlt, faTrash, faCheckCircle, faInfo, faSave } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  @ViewChild('successSaveTpl')
  private savetpl: TemplateRef<any>;
  @ViewChild('failSaveTpl')
  private savefailtpl: TemplateRef<any>;
  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {
    if (this.current) {      
      if (event.ctrlKey) {
        switch (event.keyCode) {
          case 83 : { // Ctrl + S
            this.saveMapLocal();
            break;
          }
          case 65 : { // Ctrl + A
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
     this.directories$ = api.getMapsDir();
     this.directories$.subscribe(items => { this.files = items; this.current = null});
   }

  files: TreeNode;

  directories$: Observable<any>;

  current: any;
  currentFilePath: string;

  fa = {
    map: faMap,
    plus: faPlus,
    down: faCloudDownloadAlt,
    up: faCloudUploadAlt,
    trash: faTrash,
    check: faCheckCircle,
    info: faInfo,
    save: faSave
  }

  parseMap(xml: string): { text: string, objects: number, coords: { x: string | null, y: string | null, z: string | null }, dim?: string | null, int?: string | null } {
    let parser = new DOMParser();
    let map = parser.parseFromString(xml.replace('edf:definitions="editor_main"', ''), 'text/xml');

    let firstobj = map.getElementsByTagName("object")[0];
    return {
      text: xml,
      objects: Math.floor(map.getElementsByTagName('map')[0].childNodes.length/2),
      coords: {
        x: firstobj.getAttribute('posX'),
        y: firstobj.getAttribute('posY'),
        z: firstobj.getAttribute('posZ'),
      },
      dim: firstobj.getAttribute('dimension'),
      int: firstobj.getAttribute('interior')
    };
  }

  saveMapLocal(): void {
    this.electron.dialog.showSaveDialog(
      {
        title: 'Сохранить карту как',
        buttonLabel: 'Сохранить',
        defaultPath: this.current.name,
        filters: [
          { name: 'Maps(*.map)', extensions: ['map'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      }).then(res => {
        if (res.filePath) {
          console.log(res.filePath);
          this.electron.fs.writeFile(res.filePath, this.current.text, 'utf8', (err) => {
            if (err) throw err;
            console.log('success');
          });
          this.toast.show(this.savetpl, { classname: 'bg-success text-light', delay: 3000 });
        }
      }).catch( res => {
        this.toast.show(this.savefailtpl, { classname: 'bg-danger text-light', delay: 3000 });
        console.error(res);
      })
  }

  getMap(path: { path: string, name?: string}) {
    this.currentFilePath = path.path;
    this.api.getMap(path.path).subscribe(map => {
      this.current = this.parseMap(map);
      this.current.name = path.name;
      this.api.loading = false;
    })
  }

  deleteMapCloud(): void {
    let sub: any;
    const dialogOpts = {
        type: 'warning',
        buttons: ['Удалить', 'Отмена'],
        title: `Подтверждение удаления`,
        message: `Вы точно хотите удалить карту ${this.currentFilePath}? После подтверждения она будет безвозвратно удалена с сервера.`
      }
    this.electron.dialog.showMessageBox(dialogOpts).then(
      val => {
        if (val.response === 0) {
          sub = this.api.deleteMap(this.currentFilePath).subscribe(() => {
            this.toast.show(this.savetpl, { classname: 'bg-success text-light', delay: 3000 });
          });
        }
      }
    ).finally(() => { if (sub) sub.unsubscribe() });
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      filter(params => (params.path || params.name))
    ).subscribe(params => {
      console.log(params);
      this.currentFilePath = params.path;
      this.getMap({path: params.path, name: params.name});
    });
  }

}
