import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { ApiService } from '@lars/api.service';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { switchMap, take, filter } from 'rxjs/operators';
import { ITreeNode } from '@lars/interfaces/app.interfaces';
import { ToastService } from '@lars/toast.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { faSave, faInfo, faFileSignature, faTrash, faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { ElectronService } from '@lars/core/services';
import { ConfigsService } from '../configs.service';
import { IOutputAreaSizes } from 'angular-split';

@Component({
  selector: 'app-config-editor',
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.scss']
})
export class ConfigEditorComponent implements OnInit, OnDestroy {

  public files: ITreeNode;

  private _directories$: Observable<any>;

  public currentFilePath: string;
  public progress: number = 0;
  public loading: boolean = false;

  private _uploadsSubscriptions: Subscription = new Subscription();
  private _directoriesSubscription: Subscription;

  public paneStates: number[] = [];

  fa = {
    conf: faFileSignature,
    save: faSave,
    del: faTrash
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
    this._directories$ = this.configs.reloader$.pipe(switchMap(() => _api.getConfigsDir()));
    
    this._directoriesSubscription = this._directories$.subscribe(items => {
      this.files = items;
    });
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
    return ['amx', 'so', 'db', 'cadb'].every((bin: string) => splited[splited.length - 1] !== bin);
  }

  public toConfig(path: { path: string, name?: string }) {
    this.currentFilePath = path.path;
    if (path.name) this._api.addToRecent('files', path);
    if (this._isNotBinary(path.name)) this._router.navigate(['/home/configs/doc'], { queryParams: { path: path.path , name: path.name }});
    else this._router.navigate(['/home/configs/binary'], { queryParams: { path: path.path , name: path.name }});
  }

  touchFile(path: string) {
    this.currentFilePath = path;
    this._router.navigate(['/home/configs/doc'], { queryParams: { path, touch: true }});
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
                            
                              this.reloadFileTree();
                              
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
                            
                            this.reloadFileTree();
                            this._uploadsSubscriptions.remove(sub)
                          },
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
    this._uploadsSubscriptions.unsubscribe();
    this._directoriesSubscription.unsubscribe();
  }
}
