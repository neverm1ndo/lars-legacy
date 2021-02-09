import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';
import { TreeNode } from '../interfaces/app.interfaces';
import { ToastService } from '../toast.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { faSave, faInfo, faFileSignature, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FileTreeComponent } from '../file-tree/file-tree.component';
import { ElectronService } from '../core/services/electron/electron.service';
import { UserService } from '../user.service';

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
  binStats: { size: number; mime: string; lastm: Date }

  directories$: Observable<any>;

  textplain: string | undefined = undefined;

  currentFilePath: string;
  progress: number = 0;
  dprogress: number = 0;

  fa = {
    conf: faFileSignature,
    save: faSave,
    del: faTrash
  }

  reloader$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    public api: ApiService,
    public route: ActivatedRoute,
    public toast: ToastService,
    private electron: ElectronService,
    private ngZone: NgZone,
    public user: UserService
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

  getConfig(path: { path: string, name?: string }) {
    this.currentFilePath = path.path;
    if (path.name) {
      this.api.addToRecent('files', path);
    }
    if (this.notBinary(path.name)) {
      this.showBinary = false;
      const getConfSub = this.api.getConfigText(path.path).subscribe((textplain: string) => {
        this.textplain = textplain;
        getConfSub.unsubscribe();
      });
    } else {
      if (this.textplain) this.textplain = undefined;
      const getFileSub = this.api.getFileInfo(path.path).subscribe((stats: any) => {
        this.binStats = stats;
        this.showBinary = true;
        getFileSub.unsubscribe();
      })
    }
  }

  reloadFileTree(): void {
    this.reloader$.next(null);
  }

  deleteFile(): void {
    const dialogOpts = {
        type: 'warning',
        buttons: ['Удалить', 'Отмена'],
        title: `Подтверждение удаления`,
        message: `Вы точно хотите удалить файл ${this.currentFilePath}? После подтверждения он будет безвозвратно удален с сервера.`
      }
    this.electron.dialog.showMessageBox(dialogOpts).then(
      val => {
        if (val.response === 0) {
           this.api.deleteMap(this.currentFilePath).subscribe(() => {});
          this.toast.show(`Файл <b>${ this.currentFilePath }</b> удален с сервера`,
            {
              classname: 'bg-success text-light',
              delay: 3000,
              icon: faTrash
            });
          this.showBinary = false;
        }
      }
    ).finally(() => { this.reloadFileTree(); });
  }

  downloadFile(): void {
    let filename: string = ((): string => {
      const spl = this.currentFilePath.split('/');
      return spl[spl.length - 1];
    })();
    this.electron.dialog.showSaveDialog(
      {
        title: 'Сохранить карту как',
        buttonLabel: 'Сохранить',
        defaultPath: filename,
        filters: [
          { name: 'All Files', extensions: ['*'] }
        ]
      }).then(res => {
        if (res.filePath && !res.canceled) {
          this.electron.ipcRenderer.send('download-file', { remotePath: this.currentFilePath, localPath: res.filePath, token: JSON.parse(localStorage.getItem('user')).token })
        }
      }).catch( res => {
        this.toast.show(`Файл <b>${ res.filePath }</b> не был загружен`,
          {
            classname: 'bg-warning text-dark',
            delay: 5000,
            icon: faInfo,
            subtext: res.message
           });
        console.error(res);
      })
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
    this.route.queryParams.pipe(
      filter(params => (params.path || params.name))
    ).subscribe(params => {
      this.currentFilePath = params.path;
      this.getConfig({path: params.path, name: params.name});
    });
    this.electron.ipcRenderer.on('download-progress', (event: any, progress: {total: number, loaded: number}) => {
      this.ngZone.run(() => {
        this.dprogress = Math.round(100 * progress.loaded / progress.total);
      })
    });
    this.electron.ipcRenderer.on('download-error', (event: any, err) => {
      this.ngZone.run(() => {
        this.dprogress = 0;
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
          this.dprogress = 0;
        }, 2000);
      });
    });
  }
}
