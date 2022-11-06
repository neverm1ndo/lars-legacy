import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent, SimpleLineProcessComponent, LineProcessComponent } from './components/';

import { WebviewDirective, LetDirective } from './directives/';

import { FileSizePipe } from '@lars/pipes/file-size.pipe';
import { RolePipe } from '@lars/pipes/role.pipe';
import { RulesPipe } from '@lars/pipes/rules.pipe';

@NgModule({
  declarations: [PageNotFoundComponent, SimpleLineProcessComponent, LineProcessComponent, WebviewDirective, FileSizePipe, RolePipe, RulesPipe, LetDirective],
  imports: [CommonModule, TranslateModule],
  exports: [TranslateModule, WebviewDirective, FileSizePipe, RolePipe, RulesPipe, SimpleLineProcessComponent, LineProcessComponent, LetDirective],
  providers: []
})
export class SharedModule {}
