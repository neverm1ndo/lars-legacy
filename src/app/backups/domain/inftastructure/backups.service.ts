import { Injectable } from '@angular/core';

@Injectable()
export class BackupsService {
  constructor() {}

  public graphItems: HTMLElement[] = [];

  clear() {
    this.graphItems = [];
  }
}
