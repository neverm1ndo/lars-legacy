import { Directive, ElementRef, OnDestroy, Output } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { BackupsService } from '../../domain/inftastructure/backups.service';
import { EventEmitter } from 'stream';

@Directive({
  selector: '[graphContainer]',
  exportAs: 'graph'
})
export class BackupsGraphDirective implements OnDestroy {
  @Output() startDraw = new EventEmitter();
  @Output() endDraw = new EventEmitter();

  constructor(
    private readonly host: ElementRef,
    private readonly renderer: Renderer2,
    private readonly backups: BackupsService
  ) {
    this.redraw();
  }

  get hostElement() {
    return this.host.nativeElement as HTMLElement;
  }

  public redraw() {
    this.backups.clear();

    if (this.hostElement?.children) {
      this.hostElement.childNodes.forEach((elem) => {
        this.renderer.removeChild(this.hostElement, elem);
      });
    }

    setTimeout(() => this.drawGraph(), 0);
  }

  private applyStylesPixels(this: any, styles: { [key: string]: any }) {
    // eslint-disable-next-line guard-for-in
    for (const style in styles) {
      this.style[style] = styles[style] + 'px';
    }
  }

  private createBindBackbone(
    height: number,
    color: string,
    top: number,
    right: number,
    filename: string
  ): HTMLDivElement {
    const line = this.renderer.createElement('div');
    this.renderer.addClass(line, 'bind');

    const styles = {
      height,
      width: 3,
      paddingLeft: right,
      paddingRight: 16,
      top
    };

    line.style.background = color;
    line.dataset.filename = filename;
    line.style.position = 'relative';

    this.applyStylesPixels.call(line, styles);

    return line;
  }

  private createBindRib(width: number, color: string, top: number, left: number): HTMLDivElement {
    const line = this.renderer.createElement('div');
    this.renderer.addClass(line, 'bind-rib');

    const styles = {
      width: width + 3 + 'px',
      height: 3,
      top,
      left
    };

    line.style.background = color;
    line.style.position = 'relative';

    this.applyStylesPixels.call(line, styles);

    return line;
  }

  private drawBackbone(
    height: number,
    color: string,
    top: number,
    index: number,
    filename: string
  ): void {
    this.hostElement.append(this.createBindBackbone(height, color, top, index * 8, filename));
  }

  private drawRib(width: number, color: string, top: number, left: number): void {
    this.hostElement.append(this.createBindRib(width, color, top, left * 8));
  }

  private colorGenerator(filenames: any[]): string[] {
    function hashCode(str: string) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        // eslint-disable-next-line no-bitwise
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
    }

    function intToRGB(i: number): string {
      // eslint-disable-next-line no-bitwise
      const c = (i & 0x00ffffff).toString(16).toUpperCase();
      return '00000'.substring(0, 6 - c.length) + c;
    }

    return filenames.map((filename: string) => '#' + intToRGB(hashCode(filename)));
  }

  private drawGraph() {
    this.startDraw.emit('start');

    const childs: Element[] = this.backups.graphItems;

    const topMarge = this.hostElement.getBoundingClientRect().top - 23;
    let bb: any;
    let prevHeight = 0;
    const drawBackbones = async () => {
      const uniqueFileNames: Set<string> = new Set();

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < childs.length; i++) {
        const filename = childs[i].getAttribute('data-filename');

        this.renderer.setStyle(
          childs[i].querySelector('.marker'),
          'background',
          this.colorGenerator([filename])[0]
        );

        uniqueFileNames.add(filename);
      }

      bb = Array.from(uniqueFileNames).reduce(
        (acc, curr) => ({ ...acc, [curr]: { color: this.colorGenerator([curr])[0] } }),
        {}
      );

      for (let j = childs.length - 1; j >= 0; j--) {
        const filename = childs[j].getAttribute('data-filename');
        if (bb[filename] && !bb[filename].maxTop)
          bb[filename].maxTop = childs[j].getBoundingClientRect().top - topMarge;
        if (bb[filename]) bb[filename].minTop = childs[j].getBoundingClientRect().top - topMarge;
      }

      let index = 0;

      const chunkSize = 3;

      const filenames = [...uniqueFileNames];

      const drawChunk = () => {
        if (index < uniqueFileNames.size - chunkSize) {
          setTimeout(drawChunk);
        }

        do {
          index++;
          const filename = filenames[index - 1];

          if (!filename) break;

          if (bb[filename].maxTop === bb[filename].minTop) {
            delete bb[filename];
            continue;
          }

          const { maxTop, minTop, color } = bb[filename];

          const height = maxTop - minTop;
          const topOffset = minTop - prevHeight;

          this.drawBackbone(height, color, topOffset, index - 1, filename);

          prevHeight += maxTop - minTop;
        } while (index % chunkSize !== 0);
      };

      drawChunk();
    };

    const drawRibs = () => {
      const bbs = Object.keys(bb);

      let index = 0;

      const chunkSize = 3;

      const drawChunk = () => {
        if (index < bbs.length - chunkSize) {
          setTimeout(drawChunk);
        }

        do {
          index++;

          if (!childs[index - 1]) break;

          const filename = childs[index - 1].getAttribute('data-filename');
          if (!bb[filename]) {
            continue;
          }

          const width = (bbs.length - bbs.indexOf(filename)) * 8;
          const { color } = bb[filename];
          const topOffset =
            childs[index - 1].getBoundingClientRect().top - topMarge - prevHeight - index * 3;

          this.drawRib(width, color, topOffset, bbs.indexOf(filename));
        } while (index % chunkSize !== 0);
      };

      drawChunk();
    };

    drawBackbones();
    // drawRibs();

    // this.endDraw.emit('end');
  }

  ngOnDestroy(): void {
    this.backups.graphItems = [];
  }
}
