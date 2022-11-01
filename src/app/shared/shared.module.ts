import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent, SimpleLineProcessComponent, LineProcessComponent } from './components/';

import { WebviewDirective, LetDirective } from './directives/';

import { FileSizePipe } from '../pipes/file-size.pipe';
import { RolePipe } from '../pipes/role.pipe';
import { RulesPipe } from '../pipes/rules.pipe';

@NgModule({
  declarations: [PageNotFoundComponent, SimpleLineProcessComponent, LineProcessComponent, WebviewDirective, FileSizePipe, RolePipe, RulesPipe, LetDirective],
  imports: [CommonModule, TranslateModule],
  exports: [TranslateModule, WebviewDirective, FileSizePipe, RolePipe, RulesPipe, SimpleLineProcessComponent, LineProcessComponent, LetDirective]
})
export class SharedModule {}
