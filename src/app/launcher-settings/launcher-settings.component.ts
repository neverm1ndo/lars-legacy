import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { join } from 'path';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-launcher-settings',
  templateUrl: './launcher-settings.component.html',
  styleUrls: ['./launcher-settings.component.scss']
})
export class LauncherSettingsComponent implements OnInit {

  constructor(
  ) { }

  fa = {
    folder: faFolderOpen
  }

  settings = new FormGroup({
    samp: new FormControl(join(process.env['ProgramFiles(x86)'], 'GTASanAndreas')),
    nickname: new FormControl(JSON.parse(localStorage.getItem('user')).name),
    password: new FormControl('')
  });

  get sets() {
    return this.settings.value;
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
  }

}
