import { Component, OnDestroy } from '@angular/core';
import { ApiService } from '@lars/api.service';
import { ToastService } from '@lars/toast.service';
import { ITreeNode } from '@lars/interfaces/app.interfaces';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { IOutputAreaSizes } from 'angular-split';

import { faInfo, faSave, faFolderPlus } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],

})
export class MapsComponent implements OnDestroy {

  directoriesSubscription: Subscription;

  files: ITreeNode;
  expanded: string[] = [];

  directories$: Observable<any>;
  reloader$: BehaviorSubject<any> = new BehaviorSubject(null);

  current: any;
  xml: string;
  currentFilePath: string;
  currentFileName: string;
  progress: number = 0;
  mapObjects: any;

  paneStates: number[] = this.setPanesState();

  constructor(
    private _api: ApiService,
    private _router: Router,
    private _toast: ToastService,
   ) {
     this.directories$ = this.reloader$.pipe(switchMap(() => _api.getMapsDir()));
    
     this.directoriesSubscription = this.directories$.subscribe(items => {
       const expandIfExpandedBefore = (nodes: ITreeNode) => {
         for (let item of nodes.items) {
           if (item.type !== 'dir') continue;
           if (this.expanded.includes(item.path)) item.expanded = true;
           expandIfExpandedBefore(item);
         }
         items = nodes;
       };
       expandIfExpandedBefore(items);
       this.files = items;
       this.current = null;
     });
   }

   savePanesState(event: { gutterNum: number | '*', sizes: IOutputAreaSizes }): void {
     window.localStorage.setItem('lars/ui/panes/maps', JSON.stringify(event.sizes));
   }

   private setPanesState(): number[] {
     try {
       const states = JSON.parse(window.localStorage.getItem('lars/ui/panes/maps'));
       if (!states) throw 'undefined panes state';
       return states;
     } catch(err) {
       console.error(err);
       return [20, 80];
     }
   }

  chooseDir(dir: string) {
    if (this.expanded.includes(dir)) {
      this.expanded.splice(this.expanded.indexOf(dir), 1);
    } else {
      this.expanded.push(dir);
    }
  }

  toMap(path: { path: string, name?: string }) {
    this.currentFilePath = path.path;
    this._router.navigate(['/home/maps/map'], { queryParams: path });
  }

  mkdir(path: string) {
    this._api.createDirectory(path)
            .subscribe({
              next: () => {
                this.reloadFileTree();
                this._toast.show('success', `Директория ${path} создана`, path, faFolderPlus);
              },
              error: (err) => {
                this._toast.show('danger', `Директория ${path} не создана`, `${err.error.code} ${err.error.path}`, faInfo);
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
                  this._toast.show('danger', `Директория ${path} не переименована`, `${err.error.code} ${err.error.path}`, faInfo);
                }
             });
  }

  rmdir(path: string) {
    this._api.removeDirectory(path)
            .subscribe({
              next: () => {
                this.reloadFileTree();
                this._toast.show('success', `Директория ${path} удалена`, path, faFolderPlus);
              }, 
              error: (err) => {
                this._toast.show('danger', `Директория ${path} не удалена`, `${err.error.code} ${err.error.path}`, faInfo);
              }
            });
  }

  public addNewMap(event: any): void {
    let files: File[];
    let path: string;
    
    if (event.filelist) {
      files = event.filelist;
    } else {
      files = event.target.files;
    }
    if (files.length <= 0) return;
    let formData: FormData = new FormData();
    if (event.path) {
      formData.append('path', event.path);
      path = event.path;
    }
    
    for (let file of files) {
      formData.append('file', file);
    }
    
    this._api.uploadFileMap(formData)
            .subscribe({
                next: (event) => {
                    if (event.type === HttpEventType.UploadProgress) {
                      this.progress = Math.round(100 * event.loaded / event.total);
                    } else if (event instanceof HttpResponse) {
                      
                      this._toast.show('success', `Карта <b>${ files[0].name }</b> успешно добавлена`, null, faSave);
                      
                      for (let file of files) {
                        this._api.addToRecent('upload', { path, name: file.name, type: 'map'})
                      }
                    }
                  },
                  error: (err) => {
                    this._toast.show('warning', `Карта <b>${ files[0].name }</b> не была добавлена, или она добавилась, но сервер вернул ошибку`, err.message, faInfo);
                  },
                  complete: () => {
                    this.reloadFileTree();
                    setTimeout(() => { 
                      this.progress = 0; 
                    }, 1000);
                  }
              });
  }

  public reloadFileTree(): void {
    this.reloader$.next(null);
  }

  ngOnDestroy(): void {
    this.directoriesSubscription.unsubscribe();
  }

}
