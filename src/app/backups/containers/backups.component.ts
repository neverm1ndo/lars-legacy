import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
  Optional
} from '@angular/core';
import { ApiService } from '@lars/api/api.service';
import { ToastService } from '@lars/toast.service';
import { ElectronService } from '@lars/core/services';
import {
  faClipboardCheck,
  faClipboard,
  faFileSignature,
  faExclamationCircle,
  faTrash,
  faBoxOpen,
  faHdd,
  faToolbox,
  faFileArchive
} from '@fortawesome/free-solid-svg-icons';
import { catchError, take, map, switchMap, filter, tap } from 'rxjs/operators';
import {
  from,
  iif,
  of,
  throwError,
  Observable,
  BehaviorSubject,
  Subject,
  merge,
  debounceTime
} from 'rxjs';
import { handleError } from '@lars/utils';
import { Backup } from '@lars/interfaces';
import { IOutputAreaSizes } from 'angular-split';
import { HttpErrorResponse } from '@angular/common/http';
import { BackupsGraphDirective } from '../components/backups-graph/backups-graph.directive';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackupsComponent implements OnInit, OnDestroy, AfterViewInit {
  onGraphStartEnd($event: any) {
    throw new Error('Method not implemented.');
  }
  @ViewChild('graph') private _graph: BackupsGraphDirective;

  public $backups: BehaviorSubject<Backup[]> = new BehaviorSubject(null);
  private $currentSubject: BehaviorSubject<Backup> = new BehaviorSubject(null);
  public $current: Observable<Backup> = merge(
    this.$currentSubject,
    this.$currentSubject.pipe(
      filter((backup) => backup !== null),
      debounceTime(500),
      switchMap((backup: Backup) =>
        this._getBackupFile(backup.hash).pipe(
          map((text: string) => {
            backup.file.text = text;
            return backup;
          })
        )
      )
    )
  );

  public $error: Subject<Error> = new Subject();

  public paneStates: number[] = [];

  public fa = {
    sign: faFileSignature,
    trash: faTrash,
    exCircle: faExclamationCircle,
    box: faBoxOpen,
    hdd: faHdd,
    toolbox: faToolbox,
    archive: faFileArchive
  };

  public codeMirrorSettings = {
    lineNumbers: true,
    theme: 'dracula',
    lineWrapping: true,
    readOnly: true
  };

  public $backupsSize: Subject<number> = new Subject();
  public drawing$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(
    private _api: ApiService,
    private _toast: ToastService,
    @Optional() private _electron: ElectronService,
    private translateService: TranslateService
  ) {
    this.paneStates = this._setPanesState();
    this.translateService.use('ru');
  }

  public savePanesState(event: { gutterNum: number | '*'; sizes: IOutputAreaSizes }): void {
    window.localStorage.setItem('lars/ui/panes/backups', JSON.stringify(event.sizes));
  }

  public onGraphDrawEnd() {
    this.drawing$.next(false);
  }

  public onGraphDrawStart() {
    this.drawing$.next(true);
  }

  private _setPanesState(): number[] {
    try {
      const states = JSON.parse(window.localStorage.getItem('lars/ui/panes/backups'));
      if (!states) throw 'undefined states';
      return states;
    } catch (err) {
      console.error(err);
      return [20, 80];
    }
  }

  public willBeDeletedSoon(date: Date): boolean {
    return Math.round((new Date(date).getTime() - new Date().getTime()) / 1000) < 86400 * 2;
  }

  private __handleError(error: HttpErrorResponse) {
    this._toast.show(
      'danger',
      this.translateService.instant('Backups.Toast.LoadError'),
      JSON.parse(error.error).message,
      faExclamationCircle
    );
    return throwError(() => error);
  }

  public closeView() {
    this.$currentSubject.next(null);
  }

  public showBackupView(backup: Backup) {
    this.$currentSubject.next(backup);
  }

  public removeBackup(): void {
    const current: Backup = this.$currentSubject.value;

    this.translateService
      .get(
        [
          'Backups.Dialog.Delete.Confirm',
          'Backups.Dialog.Delete.Cancel',
          'Backups.Dialog.Delete.Title',
          'Backups.Dialog.Delete.Message'
        ],
        { filename: current.file.name, path: current.file.path }
      )
      .pipe(
        map((translations) => Object.values(translations)),
        map(([confirm, cancel, title, message]: string[]) => ({
          type: 'warning',
          buttons: [cancel, confirm],
          title,
          message
        })),
        switchMap((options: Electron.MessageBoxOptions) =>
          from(this._electron.ipcRenderer.invoke('message-box', options))
        ),
        switchMap((val) =>
          iif(
            () => val.response == 1,
            this._api.removeBackup(current.hash),
            this.translateService
              .get('Backups.Dialog.ClientResponseRejectError')
              .pipe(switchMap((error) => throwError(() => new Error(error))))
          )
        ),
        switchMap(() => this._api.getBackupsList()),
        catchError((error) => handleError(error)),
        take(1)
      )
      .subscribe({
        next: (backups: Backup[]) => {
          this.$backups.next(backups);
          this._toast.show(
            'success',
            this.translateService.instant('Backups.Toast.DeleteSuccess', {
              filename: current.file.name
            }),
            current.file.path,
            faClipboardCheck
          );
          this.closeView();
        },
        error: (err) => {
          console.error(err);
          this._toast.show(
            'danger',
            this.translateService.instant('Backups.Toast.DeleteError', {
              filename: current.file.name
            }),
            err.message,
            faClipboard
          );
        }
      });
  }

  public restoreBackup(): void {
    const current: Backup = this.$currentSubject.value;

    this.$currentSubject
      .pipe(
        map(({ file }) => file),
        switchMap((file) =>
          this.translateService.get(
            [
              'Backups.Dialog.Install.Confirm',
              'Backups.Dialog.Install.Cancel',
              'Backups.Dialog.Install.Title',
              'Backups.Dialog.Install.Message'
            ],
            { filename: file.name, path: file.path }
          )
        ),
        map((translations) => Object.values(translations)),
        map(([confirm, cancel, title, message]: string[]) => ({
          type: 'warning',
          buttons: [cancel, confirm],
          title,
          message
        })),
        switchMap((options: Electron.MessageBoxOptions) =>
          from(this._electron.ipcRenderer.invoke('message-box', options))
        ),
        switchMap((val: Electron.MessageBoxReturnValue) =>
          iif(
            () => val.response === 1,
            this._api.restoreBackup(current.hash),
            this.translateService
              .get('Backups.Dialog.ClientResponseRejectError')
              .pipe(switchMap((error) => throwError(() => new Error(error))))
          )
        ),
        catchError((error) => handleError(error)),
        take(1)
      )
      .subscribe({
        next: () => {
          this._toast.show(
            'success',
            this.translateService.instant('Backups.Toast.InstallSuccess', {
              filename: current.file.name
            }),
            current.file.path,
            faClipboardCheck
          );
        },
        error: (err) => {
          console.error(err);
          this._toast.show(
            'danger',
            this.translateService.instant('Backups.Toast.InstallError', {
              filename: current.file.name
            }),
            err.message,
            faClipboard
          );
        }
      });
  }

  private _getBackupFile(hash: string): Observable<string> {
    return this._api.getBackupFile(hash).pipe(
      catchError((error) => this.__handleError(error)),
      take(1)
    );
  }

  ngOnInit(): void {
    of(window.localStorage.getItem('settings'))
      .pipe(
        filter((settings: string | null) => settings !== null),
        map((settings: string) => JSON.parse(settings)),
        take(1)
      )
      .subscribe(({ textEditorStyle }) => {
        this.codeMirrorSettings.theme = textEditorStyle;
      });

    this._api
      .getBackupsList()
      .pipe(take(1))
      .subscribe((backups: Backup[]) => {
        this.$backups.next(backups);
        if (backups.length) this.showBackupView(backups[0]);
      });
  }

  ngAfterViewInit(): void {
    this.$backups.subscribe((backups: Backup[]) => {
      if (this._graph) this._graph.redraw();
      if (!backups) return;

      const size = backups.reduce(
        (acc, curr) => (curr.file.bytes ? acc + (curr.file.compressed || curr.file.bytes) : acc),
        0
      );
      this.$backupsSize.next(size);
    });
  }

  ngOnDestroy() {
    this.$backups.unsubscribe();
    this.$backupsSize.unsubscribe();
    this.drawing$.unsubscribe();
  }
}
