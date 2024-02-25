import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import {
  PageNotFoundComponent,
  SimpleLineProcessComponent,
  LineProcessComponent
} from './components/';

import { WebviewDirective, LetDirective } from './directives/';

import { FileSizePipe } from '@lars/shared/pipes/file-size.pipe';
import { RolePipe } from '@lars/shared/pipes/role.pipe';
import { RulesPipe } from '@lars/shared/pipes/rules.pipe';
import { LazyLoadDirective } from './directives/lazy-load.directive';
import { ProcessPipe } from './process.pipe';
import { EntriesPipe } from './entries.pipe';
import { FilterSearchPipe } from '@lars/shared/pipes/filter-search.pipe';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    SimpleLineProcessComponent,
    LineProcessComponent,
    WebviewDirective,
    FileSizePipe,
    RolePipe,
    RulesPipe,
    LetDirective,
    LazyLoadDirective,
    ProcessPipe,
    EntriesPipe,
    FilterSearchPipe
  ],
  imports: [CommonModule, TranslateModule],
  exports: [
    ProcessPipe,
    TranslateModule,
    WebviewDirective,
    FileSizePipe,
    RolePipe,
    RulesPipe,
    SimpleLineProcessComponent,
    LineProcessComponent,
    LetDirective,
    LazyLoadDirective,
    EntriesPipe,
    FilterSearchPipe
  ],
  providers: []
})
export class SharedModule {}
