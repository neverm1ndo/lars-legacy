import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.scss']
})
export class BackupsComponent implements OnInit, AfterViewInit {

  @ViewChild('binds') binds: ElementRef<HTMLDivElement>;
  @ViewChild('backupsList') backupsItems: ElementRef<HTMLDivElement>;

  constructor(private renderer: Renderer2) { }

  backups = [
    {
      user: {
        nickname: 'Neverm1ndo',
        avatar: '',
        group_id: 10
      },
      color: 'green',
      file: {
        name: 'test_map.map.offasdfasdf',
        mime: 'text/xml',
        created: '12 Dec 2021 12:12:12',
        expires: '19 Dec 2021',
        text: '<map></map>'
      }
    },
    {
      user: {
        nickname: 'Scavenger',
        avatar: '',
        group_id: 10
      },
      color: 'orange',
      file: {
        name: 'config.conf',
        mime: 'text/xml',
        created: '12 Dec 2021 12:12:12',
        expires: '19 Dec 2021',
        text: '<map></map>'
      }
    },
    {
      user: {
        nickname: 'Neverm1ndo',
        avatar: '',
        group_id: 10
      },
      color: 'green',
      file: {
        name: 'test_map.map.off',
        mime: 'text/xml',
        created: '12 Dec 2021 12:12:12',
        expires: '19 Dec 2021',
        text: '<map></map>'
      }
    },
    {
      user: {
        nickname: 'Scavenger',
        avatar: '',
        group_id: 10
      },
      color: 'orange',
      file: {
        name: 'config.conf',
        mime: 'text/xml',
        created: '12 Dec 2021 12:12:12',
        expires: '19 Dec 2021',
        text: '<map></map>'
      }
    },
    {
      user: {
        nickname: 'Scav',
        avatar: '',
        group_id: 10
      },
      color: 'red',
      file: {
        name: 'conf.conf',
        mime: 'text/xml',
        created: '12 Dec 2021 12:12:12',
        expires: '19 Dec 2021',
        text: '<map></map>'
      }
    },
    {
      user: {
        nickname: 'Scavenger',
        avatar: '',
        group_id: 10
      },
      color: 'orange',
      file: {
        name: 'config.conf',
        mime: 'text/xml',
        created: '12 Dec 2021 12:12:12',
        expires: '19 Dec 2021',
        text: '<map></map>'
      }
    },
    {
      user: {
        nickname: 'Scavenger',
        avatar: '',
        group_id: 10
      },
      color: 'orange',
      file: {
        name: 'config.conf',
        mime: 'text/xml',
        created: '12 Dec 2021 12:12:12',
        expires: '19 Dec 2021',
        text: '<map></map>'
      }
    },
    {
      user: {
        nickname: 'Neverm1ndo',
        avatar: '',
        group_id: 10
      },
      color: 'green',
      file: {
        name: 'test_map.map.off',
        mime: 'text/xml',
        created: '12 Dec 2021 12:12:12',
        expires: '19 Dec 2021',
        text: '<map></map>'
      }
    },
  ]

  createBindBackbone(height: number, color: string, top: number, right: number, filename: string): HTMLDivElement {
    const line = this.renderer.createElement('div');
    this.renderer.addClass(line, 'bind');
    line.style.height = height + 'px';
    line.style.background = color;
    line.style.width = '3px';
    line.style.marginLeft = right + 'px';
    line.style.marginRight = '15px';
    line.dataset.filename = filename;
    line.style.top = top + 'px';
    line.style.position = 'relative';
    return line;
  }

  createBindRib(width: number, color: string, top: number, left: number): HTMLDivElement {
    const line = this.renderer.createElement('div');
    line.style.width = width + 3 + 'px';
    line.style.height = '3px';
    line.style.background = color;
    line.style.top = top + 'px';
    line.style.left = left + 'px';
    line.style.position = 'relative';
    return line;
  }

  drawBackbone(height, color, top, index: number, filename: string): void {
     this.binds.nativeElement.append(this.createBindBackbone(height, color, top, (index) * 15, filename))
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
      for (let j = 0; j < childs.length; j++) {
        const filenameB = childs[j].getAttribute('data-filename');
        if (i === j) continue;
        if (filenameA !== filenameB) continue;
        const top = childs[j].getBoundingClientRect().top - topMarge;
        this.binds.nativeElement.append(this.createBindRib(15 * (ribs.size - drawn.length + 1), colors[drawn.indexOf(filenameA)], top - height - (3*ribsCounter), 15*(drawn.length - 1)));
        ribsCounter++;
        if (maxTop < top) {
          maxTop = top;
        }
      }
      if (maxTop !== 0) {
        this.binds.nativeElement.append(this.createBindRib(15 * (ribs.size - drawn.length + 1), colors[drawn.indexOf(filenameA)], minTop - height - (3 * ribsCounter), 15*(drawn.length - 1)))
        ribsCounter++;
        this.drawBackbone(maxTop - minTop, colors[drawn.length - 1], (minTop - height) - (3*ribsCounter), drawn.length - 1, filenameA);
        height+= maxTop - minTop;
      } else {
        ribs.delete(filenameA);
      }
    }
  }



  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.drawBinds();
  }

}
