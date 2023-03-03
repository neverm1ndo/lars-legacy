import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { ApiService } from '@lars/api.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { switchMap, take, filter } from 'rxjs/operators';
import { ITreeNode } from '@lars/interfaces/app.interfaces';
import { ToastService } from '@lars/toast.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { faWindowRestore, faSave, faInfo, faFileSignature, faTrash, faFolderPlus, faCodeBranch, faCopy, faSync, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { ElectronService } from '@lars/core/services';
import { ConfigsService } from '@lars/configs/configs.service';
import { IOutputAreaSizes } from 'angular-split';

@Component({
  selector: 'app-config-editor',
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.scss']
})
export class ConfigEditorComponent implements OnInit, OnDestroy {

  public files: ITreeNode;

  public directories$: Observable<any>;

  public currentFilePath: string;
  public progress: number = 0;
  public loading: boolean = false;

  private _uploadsSubscriptions: Subscription = new Subscription();

  public paneStates: number[] = [];

  fa = {
    conf: faFileSignature,
    save: faCloudUploadAlt,
    trash: faTrash,
    fetch: faSync,
    copy: faCopy,
    branch: faCodeBranch,
    window: faWindowRestore,
  };

  constructor(
    private _api: ApiService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _toast: ToastService,
    private _electron: ElectronService,
    private _ngZone: NgZone,
    public configs: ConfigsService,
  ) {
    this.directories$ = this.configs.reloader$.pipe(
      switchMap(() => this._api.getConfigsDir())
    );
  }

  public saveFile() {
    this.configs.saveFile();
  }

  
  public savePanesState(event: { gutterNum: number | '*', sizes: IOutputAreaSizes }): void {
    window.localStorage.setItem('lars/ui/panes/configs', JSON.stringify(event.sizes));
  }

  private _setPanesState(): number[] {
    try {
      const states = JSON.parse(window.localStorage.getItem('lars/ui/panes/configs'));
      if (!states) throw 'undefined states';
      return states;
    } catch(err) {
      console.error(err);
      return [20, 80];
    }
  }

  private _isNotBinary(name: string): boolean {
    const splited = name.split('.');
    return ['amx', 'so', 'db', 'cadb', 'log'].every((bin: string) => splited[splited.length - 1] !== bin);
  }

  public toConfig({ path, name }: { path: string, name?: string }) {
    this.currentFilePath = path;
    if (name) this._api.addToRecent('files', { path, name });
    if (this._isNotBinary(name)) this._router.navigate(['/home/configs/doc'], { queryParams: { path, name}});
    else this._router.navigate(['/home/configs/binary'], { queryParams: { path, name }});
  }

  public touchFile(path: string) {
    this.currentFilePath = path;
    this._router.navigate(['/home/configs/doc'], { queryParams: { path, touch: true }});
  }

  public openRemoteWindow(): void {
    window.open(location.href + '&remote=1', '_blank')
  }

  public deleteFile(path?: string): void {
    this.configs.deleteFile(path || this.configs.path);
  }

  public pathToClipboard(): void {
    this.configs.pathToClipboard(this.configs.path);
  }

  reloadFileTree(): void {
    this.configs.reloadFileTree();
  }

  clearProgress(): void {
    this.progress = 0;
  }

  mkdir(path: string) {
    this._api.createDirectory(path)
             .subscribe({
              next: () => {
                this.reloadFileTree();
                this._toast.show('success', `Директория ${path} создана`, path, faFolderPlus);
              },
              error: (err) => {
                this._toast.show('danger', `Директория ${path} не создана`, err, faInfo);
              }
            });
  }

  mvdir(path: { path: string; dest: string }) {
    this._api.moveDirectory(path.path, path.dest)
             .subscribe({
                next: () => {
                  this.reloadFileTree();
                  this._toast.show('success', `Директория ${path.path} переименована`, path.dest, faFolderPlus);
                },
                error: (err) => {
                  console.error(err);
                  this._toast.show('danger', `Директория ${path} не переименована`, err, faInfo);
                }
          });
  }

  rmFile(path: string) {
    this.configs.deleteFile(path);
  }

  rmdir(path: string) {
    this._api.removeDirectory(path)
             .subscribe({
                next: () => {
                  this.reloadFileTree();
                  this._toast.show('success', `Директория ${path} удалена`, path, faFolderPlus);
                }, 
                error: (err) => {
                  this._toast.show('danger', `Директория ${path} не удалена`, err, faInfo);
                }
            });
  }

  addNewFile(event: any): void {
    
    let files: File[];
    let path: string = '';
    
    if (event.filelist) {
      files = event.filelist;
    } else {
      files = event.target.files;
    }
    
    if (files.length <= 0) return;
     
    let formData: FormData = new FormData();
    
    if (event.path) {
      path = event.path;
      formData.append('path', path)
    }
    
    for (let file of files) {
      formData.append('file', file);
    }
    
    const sub = this._api.uploadFileCfg(formData)
                         .subscribe({ 
                          next: (event) => {
                            if (event.type === HttpEventType.UploadProgress) {
                              this.progress = Math.round(100 * event.loaded / event.total);
                            } else if (event instanceof HttpResponse) {
                              if (files.length > 1) {
                                const buildFileList = (files: File[]): string => {
                                  let list = '';
                                  
                                  for (let file of files) {
                                    list = list + '<br><small class="pl-2"> > '+file.name+'</small>';
                                    this._api.addToRecent('upload', { path, name: file.name, type: 'config'})
                                  };
                                  
                                  return list;
                                }
                                
                                this._toast.show('success', `Файлы конфигурации (${files.length}) ${buildFileList(files)} <br> успешно загружены в директорию`, path, faSave);
                              } else {
                                this._toast.show('success', `Конфигурационный файл <b>${files[0].name}</b> успешно загружен`, null, faSave);
                              }
                              
                              setTimeout(() => { 
                                this.clearProgress(); 
                              }, 1000);
                              
                              this._uploadsSubscriptions.remove(sub);
                            }
                          },
                          error: (err) => {
                            this.clearProgress();
                            
                            if (files.length > 1) {
                              this._toast.show('warning', `Конфигурационныe файлы (${ files.length }) не были загружены, или они загрузились, но сервер вернул ошибку`, err.message, faInfo);
                            } else {
                              this._toast.show('warning', `Конфигурационный файл <b>${ files[0].name }</b> не был загружен, или он загрузился, но сервер вернул ошибку`, err.message, faInfo);
                            }
                            
                            console.error(err);
                            this._uploadsSubscriptions.remove(sub)
                          },
                          complete: () => {
                            this.reloadFileTree();
                          }
                        });
                        this._uploadsSubscriptions.add(sub);
  }

  ngOnInit(): void {
    this.paneStates = this._setPanesState();
    this._route.queryParams.pipe(
                              take(1),
                              filter(params => params.path)
                            )
                            .subscribe({
                              next: ({ path, name }: Params) => this.toConfig({ path, name }),
                            });
    
    this._electron.ipcRenderer.on('download-progress', (_event: any, progress: {total: number, loaded: number}) => {
      this._ngZone.run(() => {
        this.configs.dprogress$.next(Math.round(100 * progress.loaded / progress.total));
      });
    });
    
    this._electron.ipcRenderer.on('download-error', (_event: any, err) => {
      this._ngZone.run(() => {
        this.configs.dprogress$.next(0);
        this._toast.show('danger', `Произошла ошибка в загрузке файла <b>${ this.currentFilePath }</b>. Сервер вернул ошибку`, err.message, faInfo);
      });
    });
    
    this._electron.ipcRenderer.on('download-end', () => {
      this._ngZone.run(() => {
        this._toast.show('success', `Файл <b>${ this.currentFilePath }</b> успешно загружен`, null, faInfo);
        setTimeout(() => {
          this.configs.dprogress$.next(0);
        }, 2000);
      });
    });
  }
  
  ngOnDestroy(): void {
    this.configs.stats$.next(null);
    this._uploadsSubscriptions.unsubscribe();
  }
}
