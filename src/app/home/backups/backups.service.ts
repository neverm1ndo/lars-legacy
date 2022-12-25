import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'any'
})
export class BackupsService {

  constructor() { }

  public graphItems: Element[] = [];
}
