import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TreeNode } from '../interfaces/app.interfaces';

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

  constructor(
    public api: ApiService,
    public route: ActivatedRoute
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
