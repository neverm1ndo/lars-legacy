import { Directive, ElementRef } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { BackupsService } from '../backups.service';

@Directive({
  selector: '[graphContainer]'
})
export class BackupsGraphDirective {

  constructor(
    private _host: ElementRef,
    private _renderer: Renderer2,
    private _backups: BackupsService,
  ) {
    setTimeout(() => this._drawGraph(), 0);
  }

  get host() {
    return this._host.nativeElement;
  }

  private _applyStylesPx(this: any, styles: { [key: string] : any }) {
    for (let style in styles) {
      this.style[style] = styles[style] + 'px';
    };
  }

  private _createBindBackbone(height: number, color: string, top: number, right: number, filename: string): HTMLDivElement {
    const line = this._renderer.createElement('div');
    this._renderer.addClass(line, 'bind');
    
    const styles = {
      height,
      width: 3,
      marginLeft: right,
      marginRight: 8,
      top,
    };

    line.style.background = color;
    line.dataset.filename = filename;
    line.style.position = 'relative';
    
    this._applyStylesPx.call(line, styles);

    return line;
  }

  private _createBindRib(width: number, color: string, top: number, left: number): HTMLDivElement {
    const line = this._renderer.createElement('div');
    this._renderer.addClass(line, 'bind-rib')
    
    const styles = {
      width: (width + 3) + 'px',
      height: 3,
      top,
      left,
    };
    
    line.style.background = color;
    line.style.position = 'relative';

    this._applyStylesPx.call(line, styles);

    return line;
  }

  private _drawBackbone(height: number, color: string, top: number, index: number, filename: string): void {
     this._host.nativeElement.append(this._createBindBackbone(height, color, top, (index) * 8, filename));
  }
  private _drawRib(width: number, color: string, top: number, left: number): void {
     this._host.nativeElement.append(this._createBindRib(width, color, top, left * 8));
  }
  private _colorGenerator(filenames: any[]): string[] {
    
    function hashCode(str: string) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
         hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
    };
    
    function intToRGB(i: number): string {
      let c = (i & 0x00FFFFFF)
          .toString(16)
          .toUpperCase();
      return "00000".substring(0, 6 - c.length) + c;
    };
    
    return filenames.map((filename: string) => '#' + intToRGB(hashCode(filename)));
  }

  private async _drawGraph(): Promise<void> {
    const childs: Element[] = this._backups.graphItems;
    
    let topMarge: number = this.host.getBoundingClientRect().top - 23;
    let bb: any;
    let prevHeight: number = 0;
    const drawBackbones = async () => {
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
    const drawRibs = async () => {
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

}
