import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { ElectronService } from '../core/services';
import { ToastService } from '../toast.service';
import { MapsService } from '../maps.service';
import { TreeNode } from '../interfaces/app.interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { join } from 'path';

import { faInfo, faSave, faFolderPlus } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],

})
export class MapsComponent implements OnInit, OnDestroy {

  directoriesSubscription: Subscription;

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

  constructor(
    public api: ApiService,
    public route: ActivatedRoute,
    private router: Router,
    public electron: ElectronService,
    public toast: ToastService,
    private maps: MapsService
   ) {
     this.directories$ = this.reloader$.pipe(switchMap(() => api.getMapsDir()));
     this.directoriesSubscription = this.directories$.subscribe(items => {
       const expandIfExpandedBefore = (nodes: TreeNode) => {
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

  chooseDir(dir: string) {
    if (this.expanded.includes(dir)) {
      this.expanded.splice(this.expanded.indexOf(dir), 1);
    } else {
      this.expanded.push(dir);
    }
  }

  toMap(path: { path: string, name?: string }) {
    this.currentFilePath = path.path;
    this.router.navigate(['/home/maps/map'], { queryParams: { path: path.path , name: path.name }});
  }



  mkdir(path: string) {
    this.maps.mkdir(join(this.files.path, path))
    .subscribe(() => {
      this.reloadFileTree();
      this.toast.show(`Директория ${path} создана`,
        {
          classname: 'bg-success text-light',
          delay: 5000,
          icon: faFolderPlus,
          subtext: path
        });
    },
    (err) => {
      console.error(err);
      this.toast.show(`Директория ${path} не создана`,
        {
          classname: 'bg-danger text-light',
          delay: 5000,
          icon: faInfo,
          subtext: `${err.error.code} ${err.error.path}`
        });
    });
  }

  rmdir(path: string) {
    this.maps.rmdir(path)
    .subscribe(() => {
      this.reloadFileTree();
      this.toast.show(`Директория ${path} удалена`,
        {
          classname: 'bg-success text-light',
          delay: 5000,
          icon: faFolderPlus,
          subtext: path
        });
    },
    (err) => {
      console.error(err);
      this.toast.show(`Директория ${path} не удалена`,
        {
          classname: 'bg-danger text-light',
          delay: 5000,
          icon: faInfo,
          subtext: `${err.error.code} ${err.error.path}`
        });
    });
  }


  addNewMap(event: any): void {
    let files: any[];
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
          setTimeout(() => { this.progress = 0; }, 1000);
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
        this.reloadFileTree();
      });
  }

  reloadFileTree(): void {
    this.reloader$.next(null);
  }

  ngOnInit(): void {
    this.route.queryParams
    .pipe(take(1))
    .pipe(filter(params => (params.name || params.path)))
    .subscribe(params => {
      this.currentFilePath = params.path;
      this.toMap({ path: params.path , name: params.name });
    });
  }

  ngOnDestroy(): void {
    this.directoriesSubscription.unsubscribe();
  }

}
