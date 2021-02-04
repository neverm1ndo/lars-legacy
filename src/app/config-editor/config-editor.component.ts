import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';
import { TreeNode } from '../interfaces/app.interfaces';
import { ToastService } from '../toast.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { faSave, faInfo, faFileSignature } from '@fortawesome/free-solid-svg-icons';
import { FileTreeComponent } from '../file-tree/file-tree.component';

@Component({
  selector: 'app-config-editor',
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.scss']
})
export class ConfigEditorComponent implements OnInit {

  @ViewChild(FileTreeComponent) ftc: FileTreeComponent;

  files: TreeNode;
  expanded: string[] = [];

  directories$: Observable<any>;

  textplain: string | undefined = undefined;

  currentFilePath: string;
  progress: number = 0;

  fa = {
    conf: faFileSignature
  }

  reloader$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    public api: ApiService,
    public route: ActivatedRoute,
    public toast: ToastService
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
    this.api.getConfigText(path.path).subscribe((textplain: string) => {
      this.textplain = textplain;
    });
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
                  const buildFileList = (files): string => {
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
      console.log(params);
      this.currentFilePath = params.path;
      this.getConfig({path: params.path, name: params.name});
    });
  }
}
