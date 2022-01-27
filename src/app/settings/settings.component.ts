import { Component, OnInit } from '@angular/core';
import { settingsRoute } from '../app.animations';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [ settingsRoute ]
})
export class SettingsComponent implements OnInit {

  constructor() { }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }

  ngOnInit(): void {
  }

}
