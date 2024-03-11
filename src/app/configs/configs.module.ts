import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigsRoutingModule } from './configs-routing.module';
import { LtyFileTreeModule } from '@lars/shared/lty-file-tree/lty-file-tree.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LibertyIconsModule } from '../liberty-icons/liberty-icons.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSplitModule } from 'angular-split';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { ConfigEditorComponent } from './config-editor/config-editor.component';
import { EmptyDocComponent } from './empty-doc/empty-doc.component';
import { BinaryDocComponent } from './binary-doc/binary-doc.component';
import { TextEditorComponent } from './text-editor/text-editor.component';

import { ConfigsService } from './configs.service';

import { AutofocusDirective} from '../directives/autofocus.directive';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/configs/', '.json');
}

@NgModule({
  declarations: [ConfigEditorComponent, EmptyDocComponent, BinaryDocComponent, TextEditorComponent, AutofocusDirective],
  imports: [
    CommonModule,
    ConfigsRoutingModule,
    CodemirrorModule,
    LtyFileTreeModule,
    FontAwesomeModule,
    LibertyIconsModule,
    NgbModule,
    AngularSplitModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      },
      isolate: true
    })
  ],
  providers: [ConfigsService],
  exports: [TextEditorComponent]
})
export class ConfigsModule { }
