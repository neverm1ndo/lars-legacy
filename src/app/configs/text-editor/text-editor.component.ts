import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isEqual } from 'lodash';

import { faSave, faSync, faExclamationTriangle, faTrash, faCodeBranch } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';

import { BehaviorSubject, iif, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { ToastService } from '@lars/toast.service';
import { ConfigsService } from '@lars/configs/configs.service';

import { CodemirrorComponent } from '@ctrl/ngx-codemirror'
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
        switch (event.code) {
          case 'KeyS' : {
            if (this.changed.getValue()) this.saveFile();
            break;
          }
          case 'KeyF' : {
            this.search = true;
            break;
          }
          case 'Space' : {
            this._zone.runOutsideAngular(() => {
              this.editor.codeMirrorGlobal.commands.autocomplete(this.editor.codeMirror);
            });
            break;
          }
          default: break;
        }
      }
      if (event.shiftKey) {
        switch (event.code) {
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
      const size = +this.editorStyle.nativeElement.style.fontSize.substring(0, this.editorStyle.nativeElement.style.fontSize.length - 2);
        this.editorStyle.nativeElement.style.fontSize = String(size + event.deltaY/100) + 'px';
        window.localStorage.setItem('CE_fontSize', this.editorStyle.nativeElement.style.fontSize);
    }
  }

  public textplain: string;
  public loading: boolean = false;

  public codemirrorSettings = { // CodeMirror settings
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
    trash: faTrash,
    branch: faCodeBranch
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
                .subscribe({
                  next: () => {
                    this.loading = false;
                    this._origin = Buffer.from(this.textplain, 'utf8');
                    this.stats.size = Buffer.byteLength(this._origin);
                    this.changed.next(false);
                    this._toast.show('success', `Конфигурационный файл успешно сохранен`, this.path, faSave);
                  },
                  error: (err) => {
                    this._toast.show('danger', `Конфигурационный файл не был сохранен по причине:`, err.message, faExclamationTriangle);
                  }, 
                  complete: () => {
                    setTimeout(() => {
                      this.configs.dprogress$.next(0);
                    }, 2000);
                  }
                });
  }

  private _refreshCodeMirror(): void {
    this.editor.codeMirror.setOption('mode', this.codemirrorSettings.mode);
    this.editor.codeMirror.clearHistory();
  }

  checkChanges(): void {
    if (isEqual(this._origin, Buffer.from(this.textplain, 'utf8'))) {
      return void (this.changed.next(false));
    }
    this.changed.next(true);
  }

  ngOnInit(): void {
    if (window.localStorage.getItem('settings')) {
      this.codemirrorSettings.theme = JSON.parse(window.localStorage.getItem('settings')).textEditorStyle;
    }
    this._route.queryParams
    .pipe(
      tap(params => { this.loading = true; this.path = params.path; this.stats = null; }),
      switchMap((params) =>
      iif(() => !params.touch,
                this.configs.getConfig(params.path),
                of(['', { mime: 'text/plain', path: params.path, size: 0 }])))
    )
    .subscribe({
      next: ([file, info]) => {
        this.stats = info;
        switch (this.stats.mime) {
          case 'text/xml': this.codemirrorSettings.mode = 'xml'; break;
          case 'application/x-sh': this.codemirrorSettings.mode = 'shell'; break;
          default: this.codemirrorSettings.mode = 'coffeescript'; break;
        }
        this.textplain = file;
        this._origin = Buffer.from(file, 'utf-8');
        this.loading = false;
      }, 
      error: (err) => {
        this._toast.show('danger', `Конфигурационный файл не был загружен по причине:`, err, faExclamationTriangle);
      }
    });
  }
  ngAfterViewInit(): void {
    this._refreshCodeMirror();
    if (!window.localStorage.getItem('codemirror/font-size')) {
      window.localStorage.setItem('codemirror/font-size', '13px');
      this.editorStyle.nativeElement.style.fontSize = '13px';
    } else {
      this.editorStyle.nativeElement.style.fontSize = window.localStorage.getItem('codemirror/font-size');
    }
    this._zone.runOutsideAngular(() => {
      this.editor.codeMirrorGlobal.autocomplete = (_cm: any) => {
        this.editor.codeMirror.showHint({ hint: this.editor.codeMirrorGlobal.hint.anyword });
      }
    });
  }
  ngOnDestroy(): void {
    this.changed.complete();
  }
}
