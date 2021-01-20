import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconsComponent } from './icons/icons.component';
import { IconsService } from './icons.service';
import { ltyLogo, ltyFolderTree, ltyServerSave } from './icons/icons.lib';

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
      ltyLogo, ltyFolderTree, ltyServerSave 
    ]);
  }
}
