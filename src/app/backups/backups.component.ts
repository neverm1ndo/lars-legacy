import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.scss']
})
export class BackupsComponent implements OnInit, AfterViewInit {

  @ViewChild('binds') binds: ElementRef<HTMLDivElement>;
  @ViewChild('backupsList') backupsItems: ElementRef<HTMLDivElement>;

  constructor(
    private renderer: Renderer2,
    private api: ApiService,
  ) { }

  backups = [];
  current: any;
  actions = {
    delete: 'удалил',
    change: 'изменил',
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
          width: 8 * (orphans.length - drawn.indexOf(filenameA)),
        }
        if (orphans.length == 0) {
          rib.width = drawn.length - ribs.size;
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
