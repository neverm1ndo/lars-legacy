import { Directive, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { BackupsService } from '../../domain/inftastructure/backups.service';

@Directive({
  selector: "[graphContainer]",
  exportAs: "graph",
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
    this.startDraw.emit();
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
      marginLeft: right,
      marginRight: 16,
      top
    };

    line.style.background = color;
    line.dataset.filename = filename;
    line.style.position = 'relative';

    this.applyStylesPixels.call(line, styles);

    return line;
  }

  private createBindRib(width: number, color?: string): HTMLDivElement {
    const line = this.renderer.createElement('div');
    this.renderer.addClass(line, 'bind-rib');

    const styles = {
      width: width + 3,
      height: 40,
      marginBottom: 1
    };

    if (color) {
      line.style.background = color + '60';
    }

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
  ): HTMLDivElement {
    const backbone = this.createBindBackbone(height, color, top, index * 8, filename);
    this.hostElement.append(backbone);

    return backbone;
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
    const childs: HTMLElement[] = this.backups.graphItems;

    const backbones: Record<string, HTMLDivElement> = {};

    const topMarge = this.hostElement.getBoundingClientRect().top;
    let bb: any;
    let prevHeight = 0;

    const drawBackbones = async () => {
      const uniqueFileNames: Set<string> = new Set();

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < childs.length; i++) {
        const filename = childs[i].getAttribute('data-filename');

        const color = this.colorGenerator([filename])[0];
        const marker = childs[i].querySelector('.marker');

        this.renderer.setStyle(marker, 'borderColor', color);

        uniqueFileNames.add(filename);
      }

      bb = Array.from(uniqueFileNames).reduce(
        (acc, curr) => ({ ...acc, [curr]: { color: this.colorGenerator([curr])[0] } }),
        {}
      );

      for (let j = childs.length - 1; j >= 0; j--) {
        const { top } = childs[j].getBoundingClientRect();
        const filename = childs[j].getAttribute('data-filename');

        if (bb[filename] && !bb[filename].maxTop) {
          bb[filename].maxTop = top - topMarge;
        }
        if (bb[filename]) {
          bb[filename].minTop = top - topMarge;
        }
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

          const height = maxTop - minTop + 40;
          const topOffset = minTop - prevHeight;

          const backbone = this.drawBackbone(height, color, topOffset, index - 1, filename);

          backbones[filename] = backbone;

          prevHeight += height;
        } while (index % chunkSize !== 0);
      };

      drawChunk();
    };

    const drawRibs = () => {
      const bbs = Object.keys(bb);

      const container = this.renderer.createElement('div');
      this.renderer.addClass(container, 'bind-ribs');

      this.hostElement.appendChild(container);

      let index = 0;
      const chunkSize = 3;

      const drawChunk = () => {
        if (index < childs.length - chunkSize) {
          setTimeout(drawChunk);
        }

        do {
          index++;

          if (!childs[index]) {
            this.endDraw.emit();
            break;
          }

          const filename = childs[index - 1].getAttribute('data-filename');

          if (!bb[filename]) {
            const emptyRib = this.createBindRib(bbs.length * 8);
            container.appendChild(emptyRib);
            continue;
          }

          const width = (bbs.length - bbs.indexOf(filename)) * 8;
          const { color } = bb[filename];

          const rib = this.createBindRib(width, color);

          container.appendChild(rib);
        } while (index % chunkSize !== 0);
      };

      drawChunk();
    };

    drawBackbones();
    drawRibs();
  }

  ngOnDestroy(): void {
    this.backups.graphItems = [];
  }
}
