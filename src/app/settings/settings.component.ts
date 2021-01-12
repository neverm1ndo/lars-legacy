import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor() { }

  settings = new FormGroup({
    tray: new FormControl(false),
    lineChunk: new FormControl(100),
    listStyle: new FormControl('small'),
    textEditorStyle: new FormControl('material'),
  });

  setup() {
    let newSets = this.settings.getRawValue();
    window.localStorage.setItem('settings', JSON.stringify(newSets));
  }

  ngOnInit(): void {
    if (window.localStorage.getItem('settings')) {
      this.settings.setValue(JSON.parse(window.localStorage.getItem('settings')))
    } else {
      window.localStorage.setItem('settings', JSON.stringify(this.settings.getRawValue()));
    }
  }

}
