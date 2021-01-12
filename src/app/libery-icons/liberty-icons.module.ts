import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconsComponent } from './icons/icons.component';
import { IconsService } from './icons.service';
import { ltyLogo, ltyOld } from './icons/icons.lib';

@NgModule({
  declarations: [ IconsComponent ],
  imports: [
    CommonModule
  ],
    exports: [ IconsComponent ]
})
export class LibertyIconsModule {
  constructor(private ltyicons: IconsService) {
    this.ltyicons.regIcons([
      ltyLogo, ltyOld
    ]);
  }
}
