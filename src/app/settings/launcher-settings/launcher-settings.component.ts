import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { join } from 'path';
import { faFolderOpen, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { ElectronService } from '@lars/core/services';
import { OpenDialogOptions, OpenDialogReturnValue } from 'electron';
import { fileExistsValidator } from '@lars/shared/directives/client-exists-validator.directive';

@Component({
  selector: 'app-launcher-settings',
  templateUrl: './launcher-settings.component.html',
  styleUrls: ['./launcher-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LauncherSettingsComponent implements OnInit {

  constructor(
    private _electron: ElectronService,
  ) { }

  public fa = {
    folder: faFolderOpen,
    ok: faCheckCircle,
    err: faExclamationTriangle
  }

  public settings = new FormGroup({
    samp: new FormControl(
      join('C:\ProgramFiles(x86)', 'GTASanAndreas'),
      {
        validators: [Validators.required],
        asyncValidators: [fileExistsValidator('samp.exe')],
        updateOn: 'blur',
      }
    ),
    nickname: new FormControl<string>(JSON.parse(window.localStorage.getItem('user')).username, [
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

  public setPath() {
    const options: OpenDialogOptions = {
      title: 'Путь до клиента SAMP',
      defaultPath: this.sets.samp,
      properties: ['openDirectory']
    };
    
    this._electron.ipcRenderer.invoke('open-dialog', options)
                              .then((res: OpenDialogReturnValue) => {
                                
                                if (res.canceled) return;
                                
                                this.setup();

                                const [path]: string[] = res.filePaths;
                                this.settings.controls.samp.setValue(path);
                              })
                              .catch(console.error);
  }

  public setup() {
    window.localStorage.setItem('launcher', JSON.stringify(this.sets));
  }

  private _getLauncherSettingsFromStorage(): void {
    const stored: string | null = window.localStorage.getItem('launcher');

    try {
    
      if (!stored) throw new Error('EMPTY_LAUNCHER_SETTINGS');
      this.settings.setValue(JSON.parse(stored))
    
    } catch(err) {
     
      this.setup();
      console.warn(err.message, 'Launcher settings reset to default');
      
      this.settings.setValue(JSON.parse(stored))
   
    } finally {
      this.settings.markAllAsTouched();
    }
  }

  ngOnInit(): void {
    this.settings.controls.samp.updateValueAndValidity({ onlySelf: true });
    this._getLauncherSettingsFromStorage();
  }

}
