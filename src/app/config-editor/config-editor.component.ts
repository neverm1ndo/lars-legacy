import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';
import { TreeNode } from '../interfaces/app.interfaces';
import { ToastService } from '../toast.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { faSave, faInfo, faFileSignature, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FileTreeComponent } from '../file-tree/file-tree.component';
import { ElectronService } from '../core/services/electron/electron.service';
import { ConfigsService } from '../configs.service';

@Component({
  selector: 'app-config-editor',
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.scss']
})
export class ConfigEditorComponent implements OnInit {

  @ViewChild(FileTreeComponent) ftc: FileTreeComponent;

  files: TreeNode;
  expanded: string[] = [];
  showBinary: boolean = false;

  directories$: Observable<any>;

  textplain: string | undefined = undefined;

  currentFilePath: string;
  progress: number = 0;
  loading: boolean = false;

  fa = {
    conf: faFileSignature,
    save: faSave,
    del: faTrash
  }

  reloader$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    public api: ApiService,
    private router: Router,
    public toast: ToastService,
    private electron: ElectronService,
    private ngZone: NgZone,
    public configs: ConfigsService
  ) {
    this.directories$ = this.reloader$.pipe(switchMap(() => api.getConfigsDir()));
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
      this.files = items;
    });
  }

  notBinary(name:string): boolean {
    const binaries: string[] = ['amx', 'so', 'db', 'cadb'];
    const splited = name.split('.');
    return binaries.every((bin: string) => splited[splited.length - 1] !== bin);
  }

  chooseDir(dir: string) {
    if (this.expanded.includes(dir)) {
      this.expanded.splice(this.expanded.indexOf(dir), 1);
    } else {
      this.expanded.push(dir);
    }
  }

  toConfig(path: { path: string, name?: string }) {
    console.log(path)
    // this.loading = true;
    // this.textplain = undefined;
    this.currentFilePath = path.path;
    if (path.name) {
      this.api.addToRecent('files', path);
    }
    if (this.notBinary(path.name)) {
      this.router.navigate(['/home/config-editor/doc'], { queryParams: { path: path.path , name: path.name }})
    } else {
      this.router.navigate(['/home/config-editor/binary'], { queryParams: { path: path.path , name: path.name }})
    }
    //   this.showBinary = false;
    // } else {
    //   if (this.textplain) this.textplain = undefined;
    // }
  }

  reloadFileTree(): void {
    this.reloader$.next(null);
  }

  addNewFile(event: any): void {
    let files: any[];
    let path: string = '';
    if (event.filelist) { files = event.filelist; }
    else { files = event.target.files; }
       if (files.length > 0) {
         let formData: FormData = new FormData();
         if (event.path) {
           path = event.path;
           formData.append('path', path)
         }
         for (let file of files) {
            formData.append('file', file);
         }
         this.api.uploadFileCfg(formData).subscribe(
           event => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round(100 * event.loaded / event.total);
              } else if (event instanceof HttpResponse) {
                if (files.length > 1) {
                  console.log(files)
                  const buildFileList = (files: any): string => {
                    let list = '';
                    for (let file of files) {
                      list = list + '<br><small class="pl-2"> > '+file.name+'</small>';
                      this.api.addToRecent('upload', { path, name: file.name, type: 'config'})
                    };
                    return list;
                  }
                  this.toast.show(`Файлы конфигурации (${files.length}) ${buildFileList(files)} <br> успешно загружены в директорию`,
                    {
                      classname: 'bg-success text-light',
                      delay: 5000,
                      icon: faSave,
                      subtext: path
                    });
                } else {
                  this.toast.show(`Конфигурационный файл <b>${files[0].name}</b> успешно загружен`,
                    {
                      classname: 'bg-success text-light',
                      delay: 3000,
                      icon: faSave
                    });
                }
                this.reloadFileTree();
                setTimeout(() => { this.progress = 0; }, 1000)
                this.ftc.add.nativeElement.value = '';
              }
            },
            err => {
              this.progress = 0;
              if (files.length > 1) {
                this.toast.show(`Конфигурационныe файлы (${ files.length }) не были загружены, или они загрузились, но сервер вернул ошибку`,
                  {
                    classname: 'bg-warning text-dark',
                    delay: 5000,
                    icon: faInfo,
                    subtext: err.message
                  });
              } else {
                this.toast.show(`Конфигурационный файл <b>${ files[0].name }</b> не был загружен, или он загрузился, но сервер вернул ошибку`,
                  {
                    classname: 'bg-warning text-dark',
                    delay: 5000,
                    icon: faInfo,
                    subtext: err.message
                  });
              }
              console.error(err);
              this.reloadFileTree();
              this.ftc.add.nativeElement.value = '';
            });
    }
  }

  ngOnInit(): void {
    this.electron.ipcRenderer.on('download-progress', (event: any, progress: {total: number, loaded: number}) => {
      this.ngZone.run(() => {
        this.configs.dprogress.next(Math.round(100 * progress.loaded / progress.total));
      })
    });
    this.electron.ipcRenderer.on('download-error', (event: any, err) => {
      this.ngZone.run(() => {
        this.configs.dprogress.next(0);
        this.toast.show(`Произошла ошибка в загрузке файла <b>${ this.currentFilePath }</b>. Сервер вернул ошибку`,
          {
            classname: 'bg-danger text-dark',
            delay: 5000,
            icon: faInfo,
            subtext: err.message
          });
      })
    });
    this.electron.ipcRenderer.on('download-end', () => {
      this.ngZone.run(() => {
      this.toast.show(`Файл <b>${ this.currentFilePath }</b> успешно загружен`,
        {
          classname: 'bg-success text-light',
          delay: 5000,
          icon: faInfo
         });
        setTimeout(() => {
          this.configs.dprogress.next(0);
        }, 2000);
      });
    });
  }
}
