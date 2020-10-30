import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-editor',
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.scss']
})
export class ConfigEditorComponent implements OnInit {

  file: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
