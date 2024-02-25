import { Component, Optional } from '@angular/core';
import { ElectronService } from './core/services';
import { AppConfig } from '../environments/environment';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'lars-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    @Optional() private electronService: ElectronService,
    private readonly translate: TranslateService,
  ) {
    console.warn(
      '%c[WARNING]' +
        '\n%cНичего не вводите и не копируйте из консоли. Это может привести к потере данных от аккаунта или некорректной работе программы. Информация ниже предназначена только для разработчиков приложения.',
      'color: yellow; font-size: 30px',
      'font-size: 16px;'
    );
    if (electronService.isElectron && !AppConfig.production) {
      console.log('\x1b[33m[app]\x1b[0m', AppConfig);
      console.log('\x1b[33m[app]\x1b[0m', 'Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('\x1b[33m[app]\x1b[0m', 'NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log(
        '\x1b[33m[app]\x1b[0m',
        `Run in ${electronService.isElectron ? 'LARS Desktop application' : 'browser'}`
      );
    }

    this.translate.setDefaultLang('ru');
  }
}
