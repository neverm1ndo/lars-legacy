import { Component, OnInit, OnDestroy, AfterViewInit, Input, HostListener, ElementRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { isEqual } from 'lodash';

import { faSave, faSync, faExclamationTriangle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';

import { BehaviorSubject, Observable, Subject, throwError, combineLatest } from 'rxjs';
import { catchError, tap, filter, switchMap, take } from 'rxjs/operators';

import { ApiService } from '../api.service';
import { ElectronService } from '../core/services/electron/electron.service';
import { ToastService } from '../toast.service';

import Keys from '../enums/keycode.enum';
const { S, Delete, F } = Keys;

@Component({
  selector: 'text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  changed: BehaviorSubject<boolean> = new BehaviorSubject(false);
  _texp: BehaviorSubject<string> = new BehaviorSubject('');

  search: boolean = false;

  // @Input('file-info') path: string;
  // @Input('file-stats') stats: any;
  // @Input('textplain') set textp(val: string | null) {
  //   if (val) this._texp.next(val);
  // };
  @ViewChild('editor') editor: ElementRef<HTMLDivElement>;
  // @Output('delete-file') delFile: EventEmitter<string> = new EventEmitter<string>();
  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {
      if (event.ctrlKey) {
        switch (event.keyCode) {
          case S : {
            if (this.changed.getValue()) {
              this.saveFile();
            }
            break;
          }
          case F : {
            this.search = !this.search;
            break;
          }
          default : break;
        }
      }
      if (event.shiftKey) {
        switch (event.keyCode) {
          case Delete : {
            // this.deleteFile();
            break;
          }
          default : break;
        }
      }
  }
  @HostListener('mousewheel', ['$event']) wheelEvent(event: WheelEvent) {
    if (event.ctrlKey) {
      const size = +this.editor.nativeElement.style.fontSize.substr(0, this.editor.nativeElement.style.fontSize.length - 2);
        this.editor.nativeElement.style.fontSize = String(size + event.deltaY/100) + 'px';
        window.localStorage.setItem('CE_fontSize', this.editor.nativeElement.style.fontSize);
    }
  }
  plainArr: any[];
  textplain: string;
  error: Subject<any> = new Subject();
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

  constructor(
    private api: ApiService,
    private electron: ElectronService,
    private toast: ToastService,
    private route: ActivatedRoute,
  ) {}

  private handleError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
      this.error.next(error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
        this.error.next(error);
    }
    this.loading = false;
    this.toast.show(error.statusText,
      {
        classname: 'bg-danger text-light',
        delay: 7000,
        icon: faExclamationTriangle,
        subtext: error.message
      });
    return throwError(error);
  }

  pathToClipboard(): void {
    this.electron.clipboard.writeText(this.path);
    this.toast.show('Путь скопирован в буффер обмена',
    {
      classname: 'bg-success text-light',
      delay: 3000,
      icon: faCopy
    });
  }

  deleteFile(): void {
    const dialogOpts = {
        type: 'warning',
        buttons: ['Удалить', 'Отмена'],
        title: `Подтверждение удаления`,
        message: `Вы точно хотите удалить файл ${this.path}? После подтверждения он будет безвозвратно удален с сервера.`
      }
    this.electron.dialog.showMessageBox(dialogOpts).then(
      val => {
        if (val.response === 0) {
           this.api.deleteMap(this.path).subscribe(() => {});
          this.toast.show(`Файл <b>${ this.path }</b> удален с сервера`,
            {
              classname: 'bg-success text-light',
              delay: 3000,
              icon: faTrash
            });
          // this.showBinary = false;
        }
      }
    ).finally(() => {
      // this.reloadFileTree();
    });
  }

  saveFile() {
    this.loading = true;
    this.error.next(null);
    this.api.saveFile(this.path, this.textplain)
    .pipe(catchError((error) => this.handleError(error)))
    .pipe(tap(()=> {
      this.loading = false;
      this.origin = Buffer.from(this.textplain, 'utf8');
      this.changed.next(false);
      this.toast.show( `Конфигурационный файл успешно сохранен`, {
        classname: 'bg-success text-light',
        delay: 3000,
        icon: faSave,
        subtext: this.path
      });
    })).subscribe();
  }

  getConfig(path: string): Observable<any> {
    return combineLatest([
      this.api.getConfigText(path),
      this.api.getFileInfo(path)
    ])
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
    .pipe(tap(params => { this.path = params.path; return params}))
    .pipe(switchMap(params => this.getConfig(params.path)))
    .subscribe(([file, info]) => {
      console.log(file, info)
      this.textplain = file.text;
      this.origin = Buffer.from(file.text, 'utf-8');
      this.stats = info;
      switch (this.stats.mime) {
        case 'text/xml': this.cmSettings.mode = 'xml'; break;
        case 'application/x-sh': this.cmSettings.mode = 'shell'; break;
        default: break;
      }
    });
  }
  ngAfterViewInit() {
    if (!window.localStorage.getItem('CE_fontSize')) {
      window.localStorage.setItem('CE_fontSize', '13px');
      this.editor.nativeElement.style.fontSize = '13px';
    } else {
      this.editor.nativeElement.style.fontSize = window.localStorage.getItem('CE_fontSize');
    }
  }
  ngOnDestroy() {

  }
}
