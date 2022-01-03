import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppConfig } from './environments/environment';

// import 'codemirror/mode/javascript/javascript';
// import 'codemirror/mode/markdown/markdown';
// import 'codemirror/mode/clike/clike';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/coffeescript/coffeescript';

import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/anyword-hint';

import './addon/search/search';

if (AppConfig.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    preserveWhitespaces: false
  })
  .catch(err => console.error(err));
