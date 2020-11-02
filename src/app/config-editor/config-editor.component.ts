import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-config-editor',
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.scss']
})
export class ConfigEditorComponent implements OnInit, OnDestroy {

  files: string[] = [];

  directories$: Observable<any>;

  textplain: string | undefined = undefined;

  currentFilePath: string;

  constructor(public api: ApiService) {
    this.directories$ = api.getConfigsDir();
    this.directories$.subscribe(items => { this.files = items; });
  }

  getConfig(path: string) {
    this.currentFilePath = path;
    this.api.getConfigText(path).subscribe((textplain: string) => {
      this.textplain = textplain;
    });
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.api.currentFile = '';
  }

}
