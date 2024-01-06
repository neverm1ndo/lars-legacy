import { Injectable } from '@angular/core';

@Injectable()
export class BackupsService {

  constructor() { }

  public graphItems: Element[] = [];

  clear() {
    this.graphItems = [];
  }
}
