import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-config-editor',
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.scss']
})
export class ConfigEditorComponent implements OnInit {

  files: string[] = [];

  directories$: Observable<any>;

  textplane: string | undefined = undefined;

  constructor(public api: ApiService) {
    this.directories$ = api.getConfigsDir();
    this.directories$.subscribe(items => { this.files = items; });
  }

  getConfig(path: string) {
    console.log(path);

    this.api.getConfigText(path).subscribe((textplane: string) => {
      this.textplane = textplane;
      console.log(textplane);

    });
  }

  ngOnInit(): void {
  }

}
