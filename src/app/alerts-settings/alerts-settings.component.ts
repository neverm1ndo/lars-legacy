import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-alerts-settings',
  templateUrl: './alerts-settings.component.html',
  styleUrls: ['./alerts-settings.component.scss']
})
export class AlertsSettingsComponent implements OnInit {

  constructor() { }

  settings = new FormGroup({
    playerReport: new FormControl(false),
    autoBan: new FormControl(false),
    // autoBlock: new FormControl(false),
    // serverShutdown: new FormControl(false),
    // serverRestart: new FormControl(false),
  });
  ngOnInit(): void {
  }

}
