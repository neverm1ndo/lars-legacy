import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-config-editor',
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.scss']
})
export class ConfigEditorComponent implements OnInit {

  files: string[] = [];

  directories$: Observable<any>;

  textplain: string | undefined = undefined;

  currentFilePath: string;

  constructor(
    public api: ApiService,
    public route: ActivatedRoute
  ) {
    this.directories$ = api.getConfigsDir();
    this.directories$.subscribe(items => { this.files = items; });
  }

  addToRecent(val: {path: string, name?: string}): void {
    let last = JSON.parse(localStorage.getItem('last'));
    function exists() {
      for (let i = 0; i < last.files.length; i++) {
        if (last.files[i].name === val.name) {
          return true;
        }
      }
      return false;
    }
    if (!exists()) {
      if (last.files.length >= 5) {
        last.files.splice(-(last.search.length), 0, val);
        last.files.pop();
      } else {
        last.files.push(val);
      }
      localStorage.setItem('last', JSON.stringify(last));
    }
  }

  getConfig(path: { path: string, name?: string }) {
    this.currentFilePath = path.path;
    if (path.name) {
      this.addToRecent(path);
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
