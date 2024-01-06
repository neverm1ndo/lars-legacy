import { Directive, ElementRef } from '@angular/core';
import { BackupsService } from '../../domain/inftastructure/backups.service';

@Directive({
  selector: '[graphItem]'
})
export class BackupsGraphItemDirective {

  constructor(
    private readonly _host: ElementRef,
    private readonly _backups: BackupsService,
  ) {
    this._backups.graphItems.push(this._host.nativeElement);
  }

}
