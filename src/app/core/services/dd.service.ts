import { Injectable } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class DdService {

  currentOpened: NgbDropdown;

  constructor() { }

  changeOpened(newTarget: NgbDropdown) {
    if (this.currentOpened == newTarget && !this.currentOpened.isOpen()) {
       this.currentOpened.open();
       return;
    }
    if (this.currentOpened) this.currentOpened.close();
    this.currentOpened = newTarget;
    newTarget.open();
  }
}
