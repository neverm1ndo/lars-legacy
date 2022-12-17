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

// import 'codemirror/addon/wrap/hardwrap';

import './addon/search/search';

if (AppConfig.production) {
  enableProdMode();
}

function bootstrap() {
  platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    preserveWhitespaces: false
  })
  .catch(err => console.error(err));
};


if (document.readyState === 'complete') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}

