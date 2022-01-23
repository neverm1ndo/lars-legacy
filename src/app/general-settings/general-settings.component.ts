import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services';
import { FormGroup, FormControl } from '@angular/forms';
import { GeoData } from '../interfaces';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit {

  constructor(private electron: ElectronService) { }

  version: string = this.electron.remote.app.getVersion();

  date: Date = new Date(Date.now());
  sampleGeo: GeoData = {
    country: 'Russian Federation',
    cc: 'RU',
    ip: '127.0.0.1',
    as: 12345,
    ss: '8C5EE8AAFD459854D8F9DDCC5A4E8C',
    org: 'Rostelecom OJSC',
    c: '0.3.7'
  }

  pane: 'general' | 'filter' | 'alerts' = 'general';

  settings = new FormGroup({
    tray: new FormControl(false),
    lineChunk: new FormControl(100),
    listStyle: new FormControl('small'),
    textEditorStyle: new FormControl(JSON.parse(localStorage.getItem('settings')).textEditorStyle),
  });
  textplain: string = `# Create a safe reference to the Underscore object for use below.
  _ = (obj) -> new wrapper(obj)
  # Export the Underscore object for **CommonJS**.
  if typeof(exports) != 'undefined' then exports._ = _
  # Export Underscore to global scope.
  root._ = _

  # Current version.
  _.VERSION = '1.1.0'`;

  get listStyle(): string {
    return this.settings.value.listStyle;
  }
  get textEditorStyle(): string {
    return this.settings.value.textEditorStyle;
  }

  cmSettings = {
    lineNumbers: true,
    lineWrapping: true,
    mode: 'coffeescript',
    theme: this.textEditorStyle,
    readOnly: true
  }

  setup() {
    let newSets = this.settings.getRawValue();
    localStorage.setItem('settings', JSON.stringify(newSets));
    this.cmSettings.theme = newSets.textEditorStyle;
  }

  ngOnInit(): void {
    if (localStorage.getItem('settings')) {
      this.settings.setValue(JSON.parse(localStorage.getItem('settings')))

    } else {
      localStorage.setItem('settings', JSON.stringify(this.settings.getRawValue()));
    }
  }

}
