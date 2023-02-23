import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent, SimpleLineProcessComponent, LineProcessComponent } from './components/';

import { WebviewDirective, LetDirective } from './directives/';

import { FileSizePipe } from '@lars/pipes/file-size.pipe';
import { RolePipe } from '@lars/pipes/role.pipe';
import { RulesPipe } from '@lars/pipes/rules.pipe';
import { LazyLoadDirective } from './directives/lazy-load.directive';
import { ProcessPipe } from './process.pipe';
import { EntriesPipe } from './entries.pipe';

@NgModule({
  declarations: [PageNotFoundComponent, SimpleLineProcessComponent, LineProcessComponent, WebviewDirective, FileSizePipe, RolePipe, RulesPipe, LetDirective, LazyLoadDirective, ProcessPipe, EntriesPipe],
  imports: [CommonModule, TranslateModule],
  exports: [ProcessPipe, TranslateModule, WebviewDirective, FileSizePipe, RolePipe, RulesPipe, SimpleLineProcessComponent, LineProcessComponent, LetDirective, LazyLoadDirective, EntriesPipe],
  providers: []
})
export class SharedModule {}
