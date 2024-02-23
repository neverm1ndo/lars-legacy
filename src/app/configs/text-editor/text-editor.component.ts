import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostListener,
  ElementRef,
  ViewChild,
  NgZone,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isEqual } from 'lodash';

import { faSave, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import { BehaviorSubject, Subject, iif, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { ToastService } from '@lars/toast.service';
import { ConfigsService } from '@lars/configs/configs.service';

import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
@Component({
  selector: 'text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TextEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  public $search: Subject<boolean> = new Subject();

  public $matches: BehaviorSubject<number> = new BehaviorSubject(0);

  @ViewChild('editor') editor: CodemirrorComponent;
  @ViewChild('editorStyle') editorStyle: ElementRef<HTMLDivElement>;

  @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.ctrlKey) {
      switch (event.code) {
        case 'KeyS': {
          if (this.configs.changed$.getValue()) this.saveFile();
          break;
        }
        case 'KeyF': {
          this.openSearch();
          break;
        }
        case 'Space': {
          this.zone.runOutsideAngular(() => {
            this.editor.codeMirrorGlobal.commands.autocomplete(this.editor.codeMirror);
          });
          break;
        }
        default:
          break;
      }
    }
    if (event.shiftKey) {
      switch (event.code) {
        case 'Delete': {
          this.deleteFile();
          break;
        }
        default:
          break;
      }
    }
  }

  @HostListener('mousewheel', ['$event']) wheelEvent(event: WheelEvent) {
    if (event.ctrlKey) {
      const size = +this.editorStyle.nativeElement.style.fontSize.substring(
        0,
        this.editorStyle.nativeElement.style.fontSize.length - 2
      );
      this.editorStyle.nativeElement.style.fontSize = String(size + event.deltaY / 100) + 'px';
      window.localStorage.setItem(
        'codemirror/font-size',
        this.editorStyle.nativeElement.style.fontSize
      );
    }
  }

  public textplain: string;

  // CodeMirror settings
  public codemirrorSettings = {
    lineNumbers: true,
    theme: 'dracula',
    lineWrapping: true,
    mode: 'coffeescript'
  };

  private origin: Buffer;

  public query = {
    find: '',
    replace: ''
  };

  constructor(
    private route: ActivatedRoute,
    public configs: ConfigsService,
    private toast: ToastService,
    private zone: NgZone
  ) {}

  closeSearch(): void {
    this.$search.next(false);
  }
  openSearch(): void {
    this.$search.next(true);
  }

  searchIn(): void {
    this.zone.runOutsideAngular(() => {
      this.editor.codeMirrorGlobal.commands.find(this.editor.codeMirror, this.query.find);

      if (!this.query.find) return void this.$matches.next(0);

      let query = this.query.find;

      if (query.startsWith('/') && query.endsWith('/')) {
        query = query.substring(1, query.length - 1);
      }
      const regex = new RegExp(query, 'gi');

      this.$matches.next((this.textplain.match(regex) || []).length);
    });
  }
  replaceIn(): void {
    this.zone.runOutsideAngular(() => {
      this.editor.codeMirrorGlobal.commands.replace(
        this.editor.codeMirror,
        this.query.find,
        this.query.replace
      );
    });
    this.checkChanges();
  }
  replaceInAll(): void {
    this.zone.runOutsideAngular(() => {
      this.editor.codeMirrorGlobal.commands.replaceAll(
        this.editor.codeMirror,
        this.query.find,
        this.query.replace
      );
    });
    this.checkChanges();
  }

  saveFile(): void {
    const blob = new Blob([this.textplain], { type: this.configs.stats$.getValue().mime });
    this.configs
      .saveFileAsBlob(this.configs.path, blob)
      .pipe(
        tap(() => {
          this.configs.loading.next(true);
        })
      )
      .subscribe({
        next: () => {
          this.origin = Buffer.from(this.textplain, 'utf8');
          this.configs.stats$.getValue().size = Buffer.byteLength(this.origin);
          this.configs.changed$.next(false);
          this.configs.error.next(null);
          this.toast.show(
            'success',
            `Конфигурационный файл успешно сохранен`,
            this.configs.path,
            faSave
          );
        },
        error: (err) => {
          console.error(err);
          this.configs.error.next(err);
          this.toast.show(
            'danger',
            `Конфигурационный файл не был сохранен по причине:`,
            err.message,
            faExclamationTriangle
          );
        },
        complete: () => {
          this.configs.loading.next(false);
          setTimeout(() => {
            this.configs.dprogress$.next(0);
          }, 2000);
        }
      });
  }

  deleteFile(): void {
    this.configs.deleteFile(this.configs.path);
  }

  private _refreshCodeMirror(): void {
    this.editor.codeMirror.setOption('mode', this.codemirrorSettings.mode);
    this.editor.codeMirror.clearHistory();
  }

  checkChanges(): void {
    if (isEqual(this.origin, Buffer.from(this.textplain, 'utf8'))) {
      return void this.configs.changed$.next(false);
    }
    this.configs.changed$.next(true);
  }

  ngOnInit(): void {
    if (window.localStorage.getItem('settings')) {
      this.codemirrorSettings.theme = JSON.parse(
        window.localStorage.getItem('settings')
      ).textEditorStyle;
    }
    this.route.queryParams
      .pipe(
        tap((params) => {
          this.configs.loading.next(true);
          this.configs.path = params.path;
        }),
        switchMap((params) =>
          iif(
            () => !params.touch,
            this.configs.getConfig(params.path),
            of(['', { mime: 'text/plain', path: params.path, size: 0 }])
          )
        )
      )
      .subscribe({
        next: ([file, info]) => {
          this.configs.stats$.next(info);
          switch (info.mime) {
            case 'text/xml':
              this.codemirrorSettings.mode = 'xml';
              break;
            case 'application/x-sh':
              this.codemirrorSettings.mode = 'shell';
              break;
            default:
              this.codemirrorSettings.mode = 'coffeescript';
              break;
          }
          this.configs.changed$.next(false);
          this.textplain = file;
          this.origin = Buffer.from(file, 'utf-8');
          this.configs.loading.next(false);
        },
        error: (err) => {
          this.configs.error.next(err);
          this.toast.show(
            'danger',
            `Конфигурационный файл не был загружен по причине:`,
            err,
            faExclamationTriangle
          );
        }
      });
  }

  ngAfterViewInit(): void {
    this.configs.saveFrom$.subscribe({
      next: () => this.saveFile()
    });
    // eslint-disable-next-line no-underscore-dangle
    this._refreshCodeMirror();

    if (!window.localStorage.getItem('codemirror/font-size')) {
      window.localStorage.setItem('codemirror/font-size', '13px');
      this.editorStyle.nativeElement.style.fontSize = '13px';
    } else {
      this.editorStyle.nativeElement.style.fontSize =
        window.localStorage.getItem('codemirror/font-size');
    }

    this.zone.runOutsideAngular(() => {
      this.editor.codeMirrorGlobal.autocomplete = (_cm: any) => {
        this.editor.codeMirror.showHint({ hint: this.editor.codeMirrorGlobal.hint.anyword });
      };
    });
  }
  ngOnDestroy(): void {
    this.$matches.complete();
  }
}
