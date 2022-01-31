import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ApiService } from '../api.service';
import { ToastService } from '../toast.service';
import { ElectronService } from '../core/services';
import { faClipboardCheck, faClipboard, faFileSignature, faExclamationCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { catchError, take, map } from 'rxjs/operators'
import { throwError, combineLatest } from 'rxjs';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { IDBUser } from '../interfaces';

@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.scss'],
})
export class BackupsComponent implements OnInit, AfterViewInit {

  @ViewChild('binds') binds: ElementRef<HTMLDivElement>;
  @ViewChild('backupsList') backupsItems: ElementRef<HTMLDivElement>;

  constructor(
    private renderer: Renderer2,
    private api: ApiService,
    private toast: ToastService,
    private electron: ElectronService,
    private idbService: NgxIndexedDBService,
  ) { }

  backups = [];
  current: any;
  actions = {
    delete: 'удалил',
    change: 'изменил',
    restore: 'восстановил'
  }
  fa = {
    sign: faFileSignature,
    trash: faTrash,
    exCircle: faExclamationCircle
  }
  admins: any;
  loading: boolean = false;
  cmSettings = {
    lineNumbers: true,
    theme: 'dracula',
    lineWrapping: true,
    readOnly: true
  }

  willBeDeletedSoon(date: Date): boolean {
    return (Math.round(new Date(date).getTime() / 1000) - Math.round(new Date().getTime() / 1000)) < 86400*2;
  }

  createBindBackbone(height: number, color: string, top: number, right: number, filename: string): HTMLDivElement {
    const line = this.renderer.createElement('div');
    this.renderer.addClass(line, 'bind');
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

  createBindRib(width: number, color: string, top: number, left: number): HTMLDivElement {
    const line = this.renderer.createElement('div');
    this.renderer.addClass(line, 'bind-rib')
    line.style.width = width + 3 + 'px';
    line.style.height = '3px';
    line.style.background = color;
    line.style.top = top + 'px';
    line.style.left = left + 'px';
    line.style.position = 'relative';
    return line;
  }

  drawBackbone(height: number, color: string, top: number, index: number, filename: string): void {
     this.binds.nativeElement.append(this.createBindBackbone(height, color, top, (index) * 8, filename))
  }
  drawRib(width: number, color: string, top: number, left: number): void {
     this.binds.nativeElement.append(this.createBindRib(width, color, top, left * 8))
  }
  colorGenerator(filenames: any[]): string[] {
    function hashCode(str: string) {
        let hash = 0;
        for (var i = 0; i < str.length; i++) {
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

  drawGraph(): void {
    const childs = this.backupsItems.nativeElement.children;
    let topMarge = this.binds.nativeElement.getBoundingClientRect().top - 35;
    let bb: any;
    let prevHeight = 0;
    const drawBackbones = () => {
      const uniqueFileNames: Set<string> = new Set();
      for (let i = 0; i < childs.length; i++) {
        const filename = childs[i].getAttribute('data-filename');
        this.renderer.setStyle(childs[i].querySelector('.marker'), 'background', this.colorGenerator([filename])[0])
        uniqueFileNames.add(filename);
      }
      bb = Array.from(uniqueFileNames)
                      .reduce((acc, curr) => {
                        return {...acc, [curr]: { color: this.colorGenerator([curr])[0] }}
                      }, {})
      for (let j = childs.length - 1; j >= 0; j--) {
        const filename = childs[j].getAttribute('data-filename');
        if (bb[filename] && !bb[filename].maxTop) {
          bb[filename].maxTop = childs[j].getBoundingClientRect().top - topMarge;
        }
        if (bb[filename]) {
          bb[filename].minTop = childs[j].getBoundingClientRect().top - topMarge;
        }
      }
      Object.keys(bb).forEach((key: string) => {
        if (bb[key].maxTop === bb[key].minTop) delete bb[key]
      });
      Object.keys(bb).forEach((key: string, index: number) => {
        this.drawBackbone(
          bb[key].maxTop - bb[key].minTop,
          bb[key].color,
          bb[key].minTop - prevHeight,
          index,
          key
        );
        prevHeight += bb[key].maxTop - bb[key].minTop
      });
    }
    let ribs = 0;
    const drawRibs = () => {
      const bbs = Object.keys(bb);
      for (let i = 0; i < childs.length; i++) {
        const filename = childs[i].getAttribute('data-filename');
        if (bbs.includes(filename)) {
          ribs++;
          this.drawRib((bbs.length - 1 - bbs.indexOf(filename)+1)*8, bb[filename].color, childs[i].getBoundingClientRect().top - topMarge - prevHeight - ribs*3, bbs.indexOf(filename))
        }
      }
    }
    drawBackbones();
    drawRibs();
  }

  getBackupFile(name: string, unix: number) {
  if (this.current.file.binary) return;
    this.api.getBackupFile(name, unix).pipe(
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
        } else {
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error.message}`);
          }
          return throwError(JSON.parse(error.error));
        })
      ).pipe(take(1)).subscribe((data) => {
          this.current.file.text = data;
      }, (err) => {
        console.error(err);
        this.toast.show(`Бэкап файла ${this.current.file.name} не был загружен для просмотра по причине:`,             {
          classname: 'bg-danger text-light word-wrap',
          delay: 8000,
          icon: faClipboard,
          subtext: err.message
        });
      })
  }
  removeBackup() {
    console.log('removeBackup no implemented')
  }
  restoreBackup() {
    const dialogOpts = {
        type: 'warning',
        buttons: ['Да, установить', 'Отмена'],
        title: `Подтверждение установки бэкапа`,
        message: `Вы точно хотите установиить файл бэкапа ${this.current.file.name}? После подтверждения файл бэкапа ЗАМЕНИТ собой текущий файл ${this.current.file.path}.`
      }
    this.electron.ipcRenderer.invoke('message-box', dialogOpts).then(
      val => {
        if (val.response === 0) {
          const sub = this.api.restoreBackup(this.current.file.path, this.current.unix)
          .pipe (
            catchError(error => {
              if (error.error instanceof ErrorEvent) {
                console.error('An error occurred:', error.error.message);
              } else {
                console.error(
                  `Backend returned code ${error.status}, ` +
                  `body was: ${error.error.message}`);
                }
                return throwError(error.error);
              })
            )
            .subscribe(
              (data) => {
                console.log(data)
                this.toast.show(`Бэкап файла ${this.current.file.name} успешно установлен`,             {
                  classname: 'bg-success text-light',
                  delay: 5000,
                  icon: faClipboardCheck,
                  subtext: this.current.file.path
                });
              }, err => {
                console.error(err);
                this.toast.show(`Бэкап файла ${this.current.file.name} не был установлен по причине:`,             {
                  classname: 'bg-danger text-light word-wrap',
                  delay: 8000,
                  icon: faClipboard,
                  subtext: err.message
                });
              }, () => {
                sub.unsubscribe();
              });
        }
      }
    );
  }

  getAdminList() {
    return this.idbService.getAll('user')
    .pipe(take(1))
    .pipe(map((users) => {
      return users.reduce((acc: Object, curr: IDBUser) => {
        return {...acc, [curr.name]: { avatar: curr.avatar }}
      }, {})
    }))
  }

  ngOnInit(): void {
    if (window.localStorage.getItem('settings')) {
      this.cmSettings.theme = JSON.parse(localStorage.getItem('settings')).textEditorStyle;
    }
    this.getAdminList();
    this.loading = true;
    combineLatest([this.getAdminList(), this.api.getBackupsList().pipe(take(1))])
    .subscribe(([admins, backups]) => {
      this.admins = admins;
      this.backups = backups;
      this.loading = false;
      if (backups.length > 0) {
        setTimeout(() => { // add macrotask
          this.drawGraph();
        }, 1);
      }
    });
  }

  ngAfterViewInit(): void {
  }

}
