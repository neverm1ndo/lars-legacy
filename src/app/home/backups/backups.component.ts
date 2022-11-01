import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { ApiService } from '@lars/api.service';
import { ToastService } from '@lars/toast.service';
import { ElectronService } from '@lars/core/services';
import { faClipboardCheck, faClipboard, faFileSignature, faExclamationCircle, faTrash, faBoxOpen, faHdd } from '@fortawesome/free-solid-svg-icons';
import { catchError, take, map, switchMap, filter } from 'rxjs/operators'
import { combineLatest, from, iif, BehaviorSubject, of, throwError } from 'rxjs';
import { handleError } from '@lars/utils';
// import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Backup } from '@lars/interfaces';

@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.scss'],
})
export class BackupsComponent implements OnInit, OnDestroy {

  @ViewChild('binds') binds: ElementRef<HTMLDivElement>;
  @ViewChild('backupsList') backupsItems: ElementRef<HTMLDivElement>;

  constructor(
    private _renderer: Renderer2,
    private _api: ApiService,
    private _toast: ToastService,
    private _electron: ElectronService,
  ) { }

  public $backups: BehaviorSubject<Backup[] | null> = new BehaviorSubject(null);

  public current: Backup;

  public fa = {
    sign: faFileSignature,
    trash: faTrash,
    exCircle: faExclamationCircle,
    box: faBoxOpen,
    hdd: faHdd
  };

  public codeMirrorSettings = {
    lineNumbers: true,
    theme: 'dracula',
    lineWrapping: true,
    readOnly: true
  };

  public willBeDeletedSoon(date: Date): boolean {
    return (Math.round((new Date(date).getTime() - new Date().getTime()) / 1000)) < 86400*2;
  }

  private _createBindBackbone(height: number, color: string, top: number, right: number, filename: string): HTMLDivElement {
    const line = this._renderer.createElement('div');
    this._renderer.addClass(line, 'bind');
    line.style.height = height + 'px';
    line.style.background = color;
    line.style.width = '3px';
    line.style.marginLeft = right + 'px';
    line.style.marginRight = '8px';
    line.dataset.filename = filename;
    line.style.top = top + 'px';
    line.style.position = 'relative';
    return line;
  }

  private _createBindRib(width: number, color: string, top: number, left: number): HTMLDivElement {
    const line = this._renderer.createElement('div');
    this._renderer.addClass(line, 'bind-rib')
    line.style.width = width + 3 + 'px';
    line.style.height = '3px';
    line.style.background = color;
    line.style.top = top + 'px';
    line.style.left = left + 'px';
    line.style.position = 'relative';
    return line;
  }

  private _drawBackbone(height: number, color: string, top: number, index: number, filename: string): void {
     this.binds.nativeElement.append(this._createBindBackbone(height, color, top, (index) * 8, filename));
  }
  private _drawRib(width: number, color: string, top: number, left: number): void {
     this.binds.nativeElement.append(this._createBindRib(width, color, top, left * 8));
  }
  private _colorGenerator(filenames: any[]): string[] {
    function hashCode(str: string) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
         hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
    }
    function intToRGB(i: number){
      let c = (i & 0x00FFFFFF)
          .toString(16)
          .toUpperCase();
      return "00000".substring(0, 6 - c.length) + c;
    }
    return filenames.map((filename: string) => '#' + intToRGB(hashCode(filename)));
  }

  private _drawGraph(): void {
    const childs: HTMLCollection = this.backupsItems.nativeElement.children;
    let topMarge: number = this.binds.nativeElement.getBoundingClientRect().top - 23;
    let bb: any;
    let prevHeight: number = 0;
    const drawBackbones = () => {
      const uniqueFileNames: Set<string> = new Set();
      for (let i = 0; i < childs.length; i++) {
        const filename = childs[i].getAttribute('data-filename');
        this._renderer.setStyle(childs[i].querySelector('.marker'), 'background', this._colorGenerator([filename])[0]);
        uniqueFileNames.add(filename);
      }
      bb = Array.from(uniqueFileNames)
                .reduce((acc, curr) => {
                  return {...acc, [curr]: { color: this._colorGenerator([curr])[0] }};
                }, {});
      for (let j = childs.length - 1; j >= 0; j--) {
        const filename = childs[j].getAttribute('data-filename');
        if (bb[filename] && !bb[filename].maxTop) bb[filename].maxTop = childs[j].getBoundingClientRect().top - topMarge;
        if (bb[filename]) bb[filename].minTop = childs[j].getBoundingClientRect().top - topMarge;
      }
      let index: number = 0;
      for (let key in bb) {
        if (bb[key].maxTop === bb[key].minTop) {
          delete bb[key];
          continue;
        }
        this._drawBackbone(
          bb[key].maxTop - bb[key].minTop,
          bb[key].color,
          bb[key].minTop - prevHeight,
          index,
          key
        );
        prevHeight += bb[key].maxTop - bb[key].minTop;
        index++;
      }
    }
    let ribs: number = 0;
    const drawRibs = () => {
      const bbs = Object.keys(bb);
      for (let i = 0; i < childs.length; i++) {
        const filename = childs[i].getAttribute('data-filename');
        if (!bbs.includes(filename)) continue;
        ribs++;
        this._drawRib((bbs.length - 1 - bbs.indexOf(filename)+1)*8, bb[filename].color, childs[i].getBoundingClientRect().top - topMarge - prevHeight - ribs*3, bbs.indexOf(filename));
      }
    };
    drawBackbones();
    drawRibs();
  }

  public getBackupFile(backup: Backup): void {
  if (backup.file.binary) return;
    this._api.getBackupFile(backup.file.name, backup.unix)
              .pipe(
                catchError(error => handleError(error)),
                take(1)
              )
              .subscribe({
                next: (data) => {
                    this.current = backup;
                    this.current.file.text = data;
                }, 
                error: (err) => {
                  console.error(err);
                  this._toast.show('danger', `Бэкап файла ${backup.file.name} не был загружен для просмотра по причине:`, err.message, faExclamationCircle, 7000);
                }
              });
  }

  public removeBackup() {
    /**
    * Not Implemented;
    */
  }

  public restoreBackup() {
    const dialogOpts: Electron.MessageBoxOptions = {
      type: 'warning',
      buttons: ['Да, установить', 'Отмена'],
      title: `Подтверждение установки бэкапа`,
      message: `Вы точно хотите установиить файл бэкапа ${this.current.file.name}? После подтверждения файл бэкапа ЗАМЕНИТ собой текущий файл ${this.current.file.path}.`
    };
    from(this._electron.ipcRenderer.invoke('message-box', dialogOpts))
      .pipe(
        switchMap((val) => iif(() => val.response == 0, this._api.restoreBackup(this.current.file.path, this.current.unix.toString()), throwError(() => new Error('Cancelled by user')))),
        catchError(error => handleError(error)),
        take(1)
      )
      .subscribe({
        next: () => {
          this._toast.show('success', `Бэкап файла ${this.current.file.name} успешно установлен`, this.current.file.path, faClipboardCheck);
        },
        error: (err) => {
          console.error(err);
          this._toast.show('danger', `Бэкап файла ${this.current.file.name} не был установлен по причине:`, err.message, faClipboard);
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

    
    
      combineLatest([
        this._api.getAdminsList(),
        this._api.getBackupsList(),
      ])
      .pipe(
        take(1),
        map(([admins, backups]: [any, Backup[]]) => {
          admins = admins.reduce((acc: any, { username, user_avatar }: any) => ({
           ...acc, [username]: user_avatar
          }), {})
          return backups.map((backup: Backup) => {
            backup.user.avatar = admins[backup.user.nickname];
            return backup;
          })
        })
      )
      .subscribe((backups: Backup[]) => {
        this.$backups.next(backups);
      });
    
    this.$backups.pipe(
      filter((val) => val !== null),
    )
    .subscribe(() => {
      setTimeout(() => this._drawGraph());
    })

  }

  ngOnDestroy() {
    this.$backups.complete();
  }

}
