import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { join } from 'path';
import { faFolderOpen, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { ElectronService } from '../core/services';
import { OpenDialogReturnValue } from 'electron';

@Component({
  selector: 'app-launcher-settings',
  templateUrl: './launcher-settings.component.html',
  styleUrls: ['./launcher-settings.component.scss']
})
export class LauncherSettingsComponent implements OnInit {

  constructor(
    private electron: ElectronService
  ) { }

  fa = {
    folder: faFolderOpen,
    ok: faCheckCircle,
    err: faExclamationTriangle
  }

  clientExists: boolean;

  settings = new FormGroup({
    samp: new FormControl(
      join('C:\ProgramFiles(x86)', 'GTASanAndreas'),
      [ Validators.required ]
    ),
    nickname: new FormControl(JSON.parse(localStorage.getItem('user')).username, [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl(''),
    ip: new FormControl('185.104.113.34', [
      Validators.required,
      Validators.pattern('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')
    ]),
    port: new FormControl(7777,
      [
        Validators.required,
        Validators.min(0),
      ]
    ),
  });

  get sets() {
    return this.settings.value;
  }

  fileExisteValidator(path: string) {
    const filePath = join(path, 'samp.exe');
    return new Promise((resolve, reject) => {
      this.electron.fs.stat(filePath, (err: NodeJS.ErrnoException, stats: any) => {
        if (stats) resolve(path);
        reject(err);
      });
    })
  }

  setPath() {
    this.electron.ipcRenderer.invoke('open-dialog', {
      title: 'Путь до клиента SAMP',
      defaultPath: this.sets.samp,
      properties: ['openDirectory']
    }).then((res: OpenDialogReturnValue) => {
      if (res.canceled) return;
      return this.fileExisteValidator(res.filePaths[0]);
    }).then((path: string) => {
      this.settings.controls['samp'].setValue(path);
      this.clientExists = true;
      this.setup();
    }).catch((err) => {
      console.error(err);
      this.clientExists = false;
    })
  }

  setup() {
    localStorage.setItem('launcher', JSON.stringify(this.sets));
  }

  getLauncherSettingsFromStorage(): void {
    try {
      if (!localStorage.getItem('launcher')) throw new Error('EMPTY_LAUNCHER_SETTINGS');
      this.settings.setValue(JSON.parse(localStorage.getItem('launcher')))
    } catch(err) {
      this.setup();
      console.warn(err.message, 'Launcher settings reset to default');
    }
  }

  ngOnInit(): void {
    this.getLauncherSettingsFromStorage();
    this.fileExisteValidator(this.sets.samp)
    .then(() => { this.clientExists = true; })
    .catch(() => { this.clientExists = false; });
    this.settings.markAsTouched();
  }

}
