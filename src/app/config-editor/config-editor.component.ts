import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TreeNode } from '../interfaces/app.interfaces';
import { ToastService } from '../toast.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-config-editor',
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.scss']
})
export class ConfigEditorComponent implements OnInit {

  files: TreeNode;

  directories$: Observable<any>;

  textplain: string | undefined = undefined;

  currentFilePath: string;
  progress: number = 0;

  reloader$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    public api: ApiService,
    public route: ActivatedRoute,
    public toast: ToastService
  ) {
    this.directories$ = api.getConfigsDir();
    this.directories$.subscribe(items => { this.files = items; console.log(items);
    });
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
    let files = event.target.files;
       if (files.length > 0) {
         let formData: FormData = new FormData();
         for (let file of files) {
              formData.append('file', file);
         }
         this.api.uploadFile(formData).subscribe(
           event => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round(100 * event.loaded / event.total);
              } else if (event instanceof HttpResponse) {
                this.toast.show('Config uploaded', { classname: 'bg-success text-light', delay: 3000 });
                this.reloadFileTree();
                setTimeout(() => { this.progress = 0; }, 1000)
              }
            },
            err => {
              this.progress = 0;
              console.error(err);
              this.reloadFileTree();
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
