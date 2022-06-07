import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isEqual } from 'lodash';

import { faSave, faSync, faExclamationTriangle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';

import { BehaviorSubject, iif, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { ToastService } from '../../toast.service';
import { ConfigsService } from '../configs.service';

import { CodemirrorComponent } from '@ctrl/ngx-codemirror'
import { EditorFromTextArea } from 'codemirror';

interface EditorFromTextAreaExpanded extends EditorFromTextArea {
  showHint: ({ hint: any }) => {};
}

@Component({
  selector: 'text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  public changed: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public search: boolean = false;

  @ViewChild('editor') editor: CodemirrorComponent;
  @ViewChild('editorStyle') editorStyle: ElementRef<HTMLDivElement>;

  @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent) {

      if (event.ctrlKey) {
        switch (event.key) {
          case 's' : {
            if (this.changed.getValue()) this.saveFile();
            break;
          }
          case 'f' : {
            this.search = true;
            break;
          }
          case ' ' : {
            this._zone.runOutsideAngular(() => {
              this.editor.codeMirrorGlobal.commands.autocomplete(this.editor.codeMirror);
            })
            break;
          }
          default : break;
        }
      }
      if (event.shiftKey) {
        switch (event.key) {
          case 'Delete' : {
            this.deleteFile();
            break;
          }
          default : break;
        }
      }
  }
  @HostListener('mousewheel', ['$event']) wheelEvent(event: WheelEvent) {
    if (event.ctrlKey) {
      const size = +this.editorStyle.nativeElement.style.fontSize.substr(0, this.editorStyle.nativeElement.style.fontSize.length - 2);
        this.editorStyle.nativeElement.style.fontSize = String(size + event.deltaY/100) + 'px';
        window.localStorage.setItem('CE_fontSize', this.editorStyle.nativeElement.style.fontSize);
    }
  }

  public textplain: string;
  public loading: boolean = false;

  public cmSettings = { // CodeMirror settings
    lineNumbers: true,
    theme: 'dracula',
    lineWrapping: true,
    mode: 'coffeescript'
  };

  private _origin: Buffer;

  public fa = {
    save: faSave,
    fetch: faSync,
    copy: faCopy,
    trash: faTrash
  };

  public path: string;
  public stats: any;

  public query = {
    find: '',
    replace: '',
  };

  constructor(
    private _route: ActivatedRoute,
    public configs: ConfigsService,
    private _toast: ToastService,
    private _zone: NgZone,
  ) {}

  searchIn(): void {
    this._zone.runOutsideAngular(() => {
      this.editor.codeMirrorGlobal.commands.find(this.editor.codeMirror, this.query.find);
    });
  }
  replaceIn(): void {
    this._zone.runOutsideAngular(() => {
      this.editor.codeMirrorGlobal.commands.replace(this.editor.codeMirror, this.query.find, this.query.replace);
    });
    this.checkChanges();
  }
  replaceInAll(): void {
    this._zone.runOutsideAngular(() => {
      this.editor.codeMirrorGlobal.commands.replaceAll(this.editor.codeMirror, this.query.find, this.query.replace);
    });
    this.checkChanges();
  }

  deleteFile(): void {
    this.configs.deleteFile(this.path);
  }

  pathToClipboard(): void {
    this.configs.pathToClipboard(this.path);
  }

  saveFile(): void {
    const blob = new Blob([this.textplain], { type: this.stats.mime });
    this.loading = true;
    this.configs.saveFileAsBlob(this.path, blob)
    .subscribe(() => {
      this.loading = false;
      this._origin = Buffer.from(this.textplain, 'utf8');
      this.stats.size = Buffer.byteLength(this._origin);
      this.changed.next(false);
      this._toast.show( `Конфигурационный файл успешно сохранен`, {
        classname: 'bg-success text-light',
        delay: 3000,
        icon: faSave,
        subtext: this.path
      });
    },
    (err) => {
      this._toast.show( `Конфигурационный файл не был сохранен по причине:`, {
        classname: 'bg-danger text-light',
        delay: 6000,
        icon: faExclamationTriangle,
        subtext: err.message
      });
    }, () => {
      setTimeout(() => {
        this.configs.dprogress.next(0);
      }, 2000);
    });
  }

  private _refreshCodeMirror(): void {
    this.editor.codeMirror.setOption('mode', this.cmSettings.mode);
    this.editor.codeMirror.clearHistory();
  }

  checkChanges(): void {
    if (isEqual(this._origin, Buffer.from(this.textplain, 'utf8'))) {
      this.changed.next(false);
    } else {
      this.changed.next(true);
    }
  }

  ngOnInit(): void {
    if (window.localStorage.getItem('settings')) {
      this.cmSettings.theme = JSON.parse(localStorage.getItem('settings')).textEditorStyle;
    }
    this._route.queryParams
    .pipe(tap(params => { this.loading = true; this.path = params.path; this.stats = null; }))
    .pipe(switchMap((params) =>
      iif(() => !params.touch,
                this.configs.getConfig(params.path),
                of(['', { mime: 'text/plain', path: params.path, size: 0 }]))))
    .subscribe(([file, info]) => {
      this.stats = info;
      switch (this.stats.mime) {
        case 'text/xml': this.cmSettings.mode = 'xml'; break;
        case 'application/x-sh': this.cmSettings.mode = 'shell'; break;
        default: this.cmSettings.mode = 'coffeescript'; break;
      }
      this.textplain = file;
      this._origin = Buffer.from(file, 'utf-8');
      this.loading = false;
    }, (err) => {
      this._toast.show(`Конфигурационный файл не был загружен по причине:`, {
        classname: 'bg-danger text-light',
        delay: 6000,
        icon: faExclamationTriangle,
        subtext: `${err.status} ${err.statusText}`
      });
    });
  }
  ngAfterViewInit(): void {
    this._refreshCodeMirror();
    if (!window.localStorage.getItem('CE_fontSize')) {
      window.localStorage.setItem('CE_fontSize', '13px');
      this.editorStyle.nativeElement.style.fontSize = '13px';
    } else {
      this.editorStyle.nativeElement.style.fontSize = window.localStorage.getItem('CE_fontSize');
    }
    this._zone.runOutsideAngular(() => {
      this.editor.codeMirrorGlobal.autocomplete = (_cm: any) => {
        const editor = this.editor.codeMirror as EditorFromTextAreaExpanded;
        editor.showHint({ hint: this.editor.codeMirrorGlobal.hint.anyword });
      }
    });
  }
  ngOnDestroy(): void {
    this.changed.complete();
  }
}
