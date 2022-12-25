import { Directive, ElementRef } from '@angular/core';
import { BackupsService } from '../backups.service';

@Directive({
  selector: '[graphItem]'
})
export class BackupsGraphItemDirective {

  constructor(
    private _host: ElementRef,
    private _backups: BackupsService,
  ) {
    _backups.graphItems.push(_host.nativeElement);
  }

}
