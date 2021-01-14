import { Component, OnInit, Input, HostListener } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { faSave, faSync, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { ElectronService } from '../core/services/electron/electron.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {

  changed: BehaviorSubject<boolean> = new BehaviorSubject(false);
  _texp: BehaviorSubject<string> = new BehaviorSubject('');
  @Input('file-info') path: string;
  @Input('textplain') set textp(val: string) {
    this._texp.next(val);
  };
  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {
      if (event.ctrlKey) {
        switch (event.keyCode) {
          case 83 : { // Ctrl + S
            if (this.changed.getValue()) {
              this.saveFile();
            }
            break;
          }
          default : break;
        }
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

  initialTextplainPure: string;
  fa = {
    save: faSave,
    fetch: faSync,
    copy: faCopy
  }
  state: any;

  constructor(
    public api: ApiService,
    public electron: ElectronService,
    public toast: ToastService
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

  saveFile() {
    this.loading = true;
    this.error.next(null);
    this.api.saveFile(this.path, this.textplain)
    .pipe(catchError((error) => this.handleError(error)))
    .pipe(tap(()=> {
      this.loading = false;
      this._texp.next(this.textplain);
      this.toast.show( `Конфигурационный файл успешно сохранен`, {
        classname: 'bg-success text-light',
        delay: 3000,
        icon: faSave,
        subtext: this.path
      });
    })).subscribe();
  }

  checkChanges(): void {
    if (this.initialTextplainPure == this.textplain.replace(/\s/g, '')) {
      this.changed.next(false);
    } else {
      this.changed.next(true);
    }
  }

  ngOnInit(): void {
    if (window.localStorage.getItem('settings')) {
      this.cmSettings.theme = JSON.parse(window.localStorage.getItem('settings')).textEditorStyle;
    }
    this._texp.subscribe((tp) => {
      this.initialTextplainPure = tp.replace(/\s/g, '');
      this.textplain = tp;
      this.checkChanges();
    })
  }
}
