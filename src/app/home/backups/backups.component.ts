import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from '@lars/api.service';
import { ToastService } from '@lars/toast.service';
import { ElectronService } from '@lars/core/services';
import { faClipboardCheck, faClipboard, faFileSignature, faExclamationCircle, faTrash, faBoxOpen, faHdd, faToolbox } from '@fortawesome/free-solid-svg-icons';
import { catchError, take, map, switchMap, filter } from 'rxjs/operators'
import { from, iif, of, throwError, Observable, BehaviorSubject, Subject, Subscription } from 'rxjs';
import { handleError } from '@lars/utils';
import { Backup } from '@lars/interfaces';
import { IOutputAreaSizes } from 'angular-split';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackupsComponent implements OnInit, OnDestroy {

  @ViewChild('binds') binds: ElementRef<HTMLDivElement>;
  @ViewChild('backupsList') backupsItems: ElementRef<HTMLDivElement>;
  
  public $backups: Observable<Backup[]> = this._api.getBackupsList();
  public $current: BehaviorSubject<Backup> = new BehaviorSubject(null);
  public $error: Subject<Error> = new Subject();

  private _graphDrawSubscription: Subscription;

  public paneStates: number[] = [];

  public fa = {
    sign: faFileSignature,
    trash: faTrash,
    exCircle: faExclamationCircle,
    box: faBoxOpen,
    hdd: faHdd,
    toolbox: faToolbox,
  };

  public codeMirrorSettings = {
    lineNumbers: true,
    theme: 'dracula',
    lineWrapping: true,
    readOnly: true
  };
  
  constructor(
    private _api: ApiService,
    private _toast: ToastService,
    private _electron: ElectronService,
  ) {
    this.paneStates = this._setPanesState();
  }


  public savePanesState(event: { gutterNum: number | '*', sizes: IOutputAreaSizes }): void {
    window.localStorage.setItem('lars/ui/panes/backups', JSON.stringify(event.sizes));
  }

  private _setPanesState(): number[] {
    try {
      const states = JSON.parse(window.localStorage.getItem('lars/ui/panes/backups'));
      if (!states) throw 'undefined states';
      return states;
    } catch(err) {
      console.error(err);
      return [20, 80];
    }
  }

  public willBeDeletedSoon(date: Date): boolean {
    return (Math.round((new Date(date).getTime() - new Date().getTime()) / 1000)) < 86400*2;
  }


  private __handleError(error: HttpErrorResponse) {
    this._toast.show('danger', 'Не удалось загрузить файл бэкапа по причине:', JSON.parse(error.error).message, faExclamationCircle)
    return throwError(() => error);                               
  }

  public getBackupFile(backup: Backup): Observable<string> {  
    return this._api.getBackupFile(backup.hash)
                    .pipe(
                      catchError(error => this.__handleError(error)),
                      take(1)
                    );
  }

  public closeView() {
    this.$current.next(null);
  }

  public showBackupView(backup: Backup) {
    this.$current.next(backup)
    this._api.getBackupFile(backup.hash)
                    .pipe(
                      catchError(error => this.__handleError(error)),
                      take(1)
                    )
                    .subscribe((text: string) => {
                      backup.file.text = text;
                      this.$current.next(backup);
                    })
  }

  public removeBackup(): void {
    const current: Backup = this.$current.value;

    const dialogOpts: Electron.MessageBoxOptions = {
      type: 'warning',
      buttons: ['Удалить', 'Отмена'],
      title: `Подтверждение удаления бэкапа`,
      message: `Вы точно хотите удалить файл бэкапа ${current.file.name}? После подтверждения файл бэкапа и запись о нем безвозвратно удалятся.`
    };

    from(this._electron.ipcRenderer.invoke('message-box', dialogOpts))
    .pipe(
      switchMap((val) => iif(() => val.response == 0, this._api.removeBackup(current.hash), throwError(() => new Error('Операция отменена пользователем')))),
      catchError(error => handleError(error)),
      take(1)
    )
    .subscribe({
      next: () => {
        this._toast.show('success', `Бэкап файла ${current.file.name} успешно установлен`, current.file.path, faClipboardCheck);
      },
      error: (err) => {
        console.error(err);
        this._toast.show('danger', `Бэкап файла ${this.$current.value.file.name} не был удален по причине:`, err.message, faClipboard);
      }
    });
  }

  public restoreBackup(): void {
    const current: Backup = this.$current.value;
    
    const dialogOpts: Electron.MessageBoxOptions = {
      type: 'warning',
      buttons: ['Да, установить', 'Отмена'],
      title: `Подтверждение установки бэкапа`,
      message: `Вы точно хотите установиить файл бэкапа ${current.file.name}? После подтверждения файл бэкапа ЗАМЕНИТ собой текущий файл ${this.$current.value.file.path}.`
    };
    
    from(this._electron.ipcRenderer.invoke('message-box', dialogOpts))
      .pipe(
        switchMap((val) => iif(() => val.response == 0, this._api.restoreBackup(current.hash), throwError(() => new Error('Операция отменена пользователем')))),
        catchError(error => handleError(error)),
        take(1)
      )
      .subscribe({
        next: () => {
          this._toast.show('success', `Бэкап файла ${current.file.name} успешно установлен`, current.file.path, faClipboardCheck);
        },
        error: (err) => {
          console.error(err);
          this._toast.show('danger', `Бэкап файла ${current.file.name} не был установлен по причине:`, err.message, faClipboard);
        }
      });
  }

  ngOnInit(): void {
    of(window.localStorage.getItem('settings'))
      .pipe(
        filter((settings: string | null) => settings !== null),
        map((settings: string) => JSON.parse(settings))
      )
      .subscribe(({ textEditorStyle }) => {
        this.codeMirrorSettings.theme = textEditorStyle;
      });

  }

  ngOnDestroy() {}

}
