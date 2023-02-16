import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { IGeoData } from '@lars/interfaces';
import { ElectronService } from '@lars/core/services';
import { Observable, from } from 'rxjs';
import { UserService } from '@lars/user.service';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
})
export class GeneralSettingsComponent implements OnInit {

  constructor(
    private _electron: ElectronService,
    private _user: UserService,
  ) {}

  public version$: Observable<string> = from(this._electron.ipcRenderer.invoke('version'));

  public date: Date = new Date();
  
  public sampleGeo: IGeoData = {
    country: 'Russian Federation',
    cc: 'RU',
    ip: '127.0.0.1',
    as: 12345,
    ss: '8C5EE8AAFD459854D8F9DDCC5A4E8C',
    org: 'Rostelecom OJSC',
    cli: '0.3.7'
  }

  public settings: FormGroup = new FormGroup({
    tray: new FormControl(false),
    lineChunk: new FormControl(100),
    listStyle: new FormControl('small'),
    textEditorStyle: new FormControl('dracula'),
  });
  
  public textplain: string = `# Create a safe reference to the Underscore object for use below.
  _ = (obj) -> new wrapper(obj)
  # Export the Underscore object for **CommonJS**.
  if typeof(exports) != 'undefined' then exports._ = _
  # Export Underscore to global scope.
  root._ = _

  # Current version.
  _.VERSION = '1.1.0'`;

  public chunkSizes: { id: number; val: number }[] = [
    { id: 0, val: 100 },
    { id: 1, val: 200 },
    { id: 2, val: 300 },
    { id: 3, val: 400 },
    { id: 4, val: 500 },
  ];

  get listStyle(): string {
    return this.settings.value.listStyle;
  }
  get textEditorStyle(): string {
    return this.settings.value.textEditorStyle;
  }

  public codemirrorSettings = {
    lineNumbers: true,
    lineWrapping: true,
    mode: 'coffeescript',
    theme: this.textEditorStyle,
    readOnly: true
  };

  public setup() {
    let newSets = this.settings.getRawValue();
    window.localStorage.setItem('settings', JSON.stringify(newSets));
    this.codemirrorSettings.theme = newSets.textEditorStyle;
  }

  ngOnInit(): void {
    const { tray, lineChunk, listStyle, textEditorStyle } = this._user.getUserSettings();
    this.settings.setValue({ tray, lineChunk, listStyle, textEditorStyle });
    this.setup();
  }

}
