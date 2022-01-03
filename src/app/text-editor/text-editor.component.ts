import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isEqual } from 'lodash';

import { faSave, faSync, faExclamationTriangle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';

import { BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { ToastService } from '../toast.service';
import { ConfigsService } from '../configs.service';

import { CodemirrorComponent } from '@ctrl/ngx-codemirror'

import Keys from '../enums/keycode.enum';
const { S, Delete, F, Space } = Keys;

@Component({
  selector: 'text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  changed: BehaviorSubject<boolean> = new BehaviorSubject(false);

  search: boolean = false;

  @ViewChild('editor') editor: CodemirrorComponent;
  @ViewChild('editorStyle') editorStyle: ElementRef<HTMLDivElement>;

  @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent) {
      if (event.ctrlKey) {
        switch (event.keyCode) {
          case S : {
            if (this.changed.getValue()) {
              this.saveFile();
            }
            break;
          }
          case F : {
            this.search = true;
            break;
          }
          case Space : {
            this.zone.runOutsideAngular(() => {
              this.editor.codeMirrorGlobal.commands.autocomplete(this.editor.codeMirror);
            })
            break;
          }
          default : break;
        }
      }
      if (event.shiftKey) {
        switch (event.keyCode) {
          case Delete : {
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
  plainArr: any[];
  textplain: string;
  loading: boolean = false;
  cmSettings = {
    lineNumbers: true,
    theme: 'dracula',
    lineWrapping: true,
    mode: 'coffeescript'
  }

  origin: Buffer;
  fa = {
    save: faSave,
    fetch: faSync,
    copy: faCopy,
    trash: faTrash
  }
  state: any;
  path: string;
  stats: any;
  query = {
    find: '',
    replace: ''
  };

  constructor(
    private route: ActivatedRoute,
    public configs: ConfigsService,
    private toast: ToastService,
    private zone: NgZone,
  ) {}

  searchIn() {
    this.zone.runOutsideAngular(() => {
      this.editor.codeMirrorGlobal.commands.find(this.editor.codeMirror, this.query.find)
    })
  }
  replaceIn() {
    this.zone.runOutsideAngular(() => {
      this.editor.codeMirrorGlobal.commands.replace(this.editor.codeMirror, this.query.find, this.query.replace)
    })
    this.checkChanges();
  }
  replaceInAll() {
    this.zone.runOutsideAngular(() => {
      this.editor.codeMirrorGlobal.commands.replaceAll(this.editor.codeMirror, this.query.find, this.query.replace)
    })
    this.checkChanges();
  }

  deleteFile() {
    this.configs.deleteFile(this.path);
  }

  pathToClipboard() {
    this.configs.pathToClipboard(this.path);
  }
  saveFile() {
    this.loading = true;
    this.configs.saveFile(this.path, this.textplain)
    .subscribe(() => {
      this.loading = false;
      this.origin = Buffer.from(this.textplain, 'utf8');
      this.changed.next(false);
      this.toast.show( `Конфигурационный файл успешно сохранен`, {
        classname: 'bg-success text-light',
        delay: 3000,
        icon: faSave,
        subtext: this.path
      });
    },
    (err) => {
      this.toast.show( `Конфигурационный файл не был сохранен по причине:`, {
        classname: 'bg-danger text-light',
        delay: 6000,
        icon: faExclamationTriangle,
        subtext: err.message
      });
    })
  }

  checkChanges(): void {
    if (isEqual(this.origin, Buffer.from(this.textplain, 'utf8'))) {
      this.changed.next(false);
    } else {
      this.changed.next(true);
    }
  }



  ngOnInit(): void {
    if (window.localStorage.getItem('settings')) {
      this.cmSettings.theme = JSON.parse(localStorage.getItem('settings')).textEditorStyle;
    }
    this.route.queryParams
    .pipe(tap(params => { this.loading = true; this.path = params.path; return params}))
    .pipe(switchMap(params => this.configs.getConfig(params.path)))
    .subscribe(([file, info]) => {
      this.stats = info;
      switch (this.stats.mime) {
        case 'text/xml': this.cmSettings.mode = 'xml'; break;
        case 'application/x-sh': this.cmSettings.mode = 'shell'; break;
        default: break;
      }
      this.editor.codeMirror.clearHistory();
      this.editor.codeMirror.setOption('mode', this.cmSettings.mode);
      this.textplain = file.text;
      this.origin = Buffer.from(file.text, 'utf-8');
      this.loading = false;
      this.editor.codeMirror.clearHistory();
    }, () => {});
  }
  ngAfterViewInit() {
    if (!window.localStorage.getItem('CE_fontSize')) {
      window.localStorage.setItem('CE_fontSize', '13px');
      this.editorStyle.nativeElement.style.fontSize = '13px';
    } else {
      this.editorStyle.nativeElement.style.fontSize = window.localStorage.getItem('CE_fontSize');
    }
    this.zone.runOutsideAngular(() => {
      this.editor.codeMirrorGlobal.autocomplete = (cm: any) => {
        this.editor.codeMirror.showHint({hint: this.editor.codeMirrorGlobal.hint.anyword});
      }
    })
  }
  ngOnDestroy() {

  }
}
