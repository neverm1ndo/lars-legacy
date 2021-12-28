import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'notifications-settings',
  templateUrl: './notifications-settings.component.html',
  styleUrls: ['./notifications-settings.component.scss']
})
export class NotificationsSettingsComponent implements OnInit {

  constructor() { }

  settings = new FormGroup({
    silent: new FormControl(false),
    playerReport: new FormControl(true),
    autoBan: new FormControl(true),
    autoBlock: new FormControl(true),
    serverShutdown: new FormControl(true),
    serverRestart: new FormControl(true),
  });

  get sets() {
    return this.settings.value;
  }

  setup() {
    localStorage.setItem('alerts', JSON.stringify(this.sets));
  }

  ngOnInit(): void {
    let userSettings = JSON.parse(localStorage.getItem('alerts'));
    if (userSettings) {
      this.settings.setValue(userSettings)
    } else {
      this.setup();
    }
  }

}
