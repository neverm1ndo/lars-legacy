import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ApiService } from '../api.service';
import { ToastService } from '../toast.service';
import { ElectronService } from '../core/services/electron/electron.service';
import { faClipboardCheck, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { catchError } from 'rxjs/operators'
import { throwError } from 'rxjs';

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
    private electron: ElectronService
  ) { }

  backups = [];
  current: any;
  actions = {
    delete: 'удалил',
    change: 'изменил',
    restore: 'восстановил'
  }
  loading: boolean = false;

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

  drawBackbone(height, color, top, index: number, filename: string): void {
     this.binds.nativeElement.append(this.createBindBackbone(height, color, top, (index) * 8, filename))
  }
  colorGenerator(filenames: any[]): string[] {
    function hashCode(str) {
        let hash = 0;
        for (var i = 0; i < str.length; i++) {
           hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }
    function intToRGB(i){
      let c = (i & 0x00FFFFFF)
          .toString(16)
          .toUpperCase();
      return "00000".substring(0, 6 - c.length) + c;
    }
    return filenames.map((filename: string) => '#' + intToRGB(hashCode(filename)));
  }

  drawBinds(): void {
    let drawn: string[] = [];
    const childs = this.backupsItems.nativeElement.children;
    const ribs = new Set();
    let height = 0;
    let ribsCounter = 0;
    let topMarge = this.binds.nativeElement.getBoundingClientRect().top - 35;
    const orphans = [];
    let colors: string[];

    for (let i = 0; i < childs.length; i++) {
      const filename = childs[i].getAttribute('data-filename');
      ribs.add(filename);
    }
    colors = this.colorGenerator(Array.from(ribs));

    for (let i = 0; i < childs.length; i++) {
      const filename = childs[i].getAttribute('data-filename');
      this.renderer.setStyle(childs[i].querySelector('.marker'), 'background', colors[Array.from(ribs).indexOf(filename)])
    }


    for (let i = 0; i < childs.length; i++) {
      const filenameA = childs[i].getAttribute('data-filename');
      if (drawn.includes(filenameA)) continue;
      drawn.push(filenameA);
      let minTop = childs[i].getBoundingClientRect().top - topMarge;
      let maxTop = 0;
      let rib;
      for (let j = 0; j < childs.length; j++) {
        const filenameB = childs[j].getAttribute('data-filename');
        if (i === j) continue;
        if (orphans.includes(filenameB)) {  drawn = drawn.filter(bone => bone !== filenameB); continue; }
        if (filenameA !== filenameB) continue;
        rib = {
          left: 8 * (drawn.length),
          width: Math.abs(8 * (ribs.size - orphans.length - drawn.indexOf(filenameA))),
        }
        const top = childs[j].getBoundingClientRect().top - topMarge;
        if (maxTop < top) {
          maxTop = top;
        }
        ribsCounter++;
        this.binds.nativeElement.append(this.createBindRib(rib.width, colors[orphans.length + drawn.indexOf(filenameA)], top - height - (3*ribsCounter), rib.left));
      }
      if (maxTop !== 0) {
        this.binds.nativeElement.append(this.createBindRib(rib.width, colors[orphans.length + drawn.indexOf(filenameA)], minTop - height - (3 * ribsCounter), rib.left))
        ribsCounter++;
        this.drawBackbone(maxTop - minTop, colors[orphans.length + drawn.indexOf(filenameA)], (minTop - height) - (3*ribsCounter), drawn.length, filenameA);
        height+= maxTop - minTop;
      } else {
        drawn = drawn.filter(bone => bone !== filenameA)
        orphans.push(filenameA);
      }
      console.log(drawn)
    }
  }

  restoreBackup() {
    const dialogOpts = {
        type: 'warning',
        buttons: ['Да, установить', 'Отмена'],
        title: `Подтверждение установки бэкапа`,
        message: `Вы точно хотите установиить файл бэкапа ${this.current.file.name}? После подтверждения файл бэкапа ЗАМЕНИТ собой текущий файл ${this.current.file.path}.`
      }
    this.electron.dialog.showMessageBox(dialogOpts).then(
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
                  `body was: ${error.error}`);
                }
                return throwError(error);
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

  ngOnInit(): void {
    this.loading = true;
    const sub = this.api.getBackupsList().subscribe((backups: any) => {
      this.backups = backups;
      sub.unsubscribe();
      this.loading = false;
      setTimeout(() => { // add macrotask
        this.drawBinds();
      }, 1);
    });
  }

  ngAfterViewInit(): void {
  }

}
