import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor() { }

  date: Date = new Date(Date.now());
  sampleGeo = {
    country: 'Russian Federation',
    cc: 'RU',
    ip: '127.0.0.1',
    as: '12345',
    ss: '8C5EE8AAFD459854D8F9DDCC5A4E8C',
    org: 'Rostelecom OJSC',
    c: '0.3.7'
  }

  settings = new FormGroup({
    tray: new FormControl(false),
    lineChunk: new FormControl(100),
    listStyle: new FormControl('small'),
    textEditorStyle: new FormControl(JSON.parse(window.localStorage.getItem('settings')).textEditorStyle),
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
    window.localStorage.setItem('settings', JSON.stringify(newSets));
    this.cmSettings.theme = newSets.textEditorStyle;
  }

  ngOnInit(): void {
    if (window.localStorage.getItem('settings')) {
      this.settings.setValue(JSON.parse(window.localStorage.getItem('settings')))

    } else {
      window.localStorage.setItem('settings', JSON.stringify(this.settings.getRawValue()));
    }
  }

}
