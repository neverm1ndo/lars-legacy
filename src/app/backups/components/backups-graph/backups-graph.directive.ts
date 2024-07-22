import { Directive, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { BackupsService } from '../../domain/inftastructure/backups.service';
import { groupBy, uniqBy } from 'lodash-es';

type DrawableBackbone = {
  filename: string;
  color: string;
  child?: HTMLElement;
  rect?: {
    top: number;
    bottom: number;
  };
};

const MARKER_OFFSET = 8;
const MARKER_HEIGHT = 40;

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
      height: MARKER_HEIGHT,
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
    const backbone = this.createBindBackbone(height, color, top, index * MARKER_OFFSET, filename);
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

    if (!Boolean(childs.length)) return void this.endDraw.emit();

    const { top } = this.hostElement.getBoundingClientRect();
    let prevHeight = 0;

    const defineDrawableBackbones = () => {
      const filenames: DrawableBackbone[] = [];

      for (const child of childs) {
        const { filename } = child.dataset;
        const [color] = this.colorGenerator([filename]);
        const marker = child.querySelector('.marker');

        this.renderer.setStyle(marker, 'borderColor', color);

        filenames.push({ filename, color, child });
      }

      const grouped = groupBy(filenames, 'filename');

      return uniqBy(filenames, 'filename')
        .filter((unique) => grouped[unique.filename].length > 1)
        .map(({ filename, color }) => ({
          filename,
          color,
          rect: {
            top: grouped[filename][0].child.getBoundingClientRect().top - top,
            bottom:
              grouped[filename][grouped[filename].length - 1].child.getBoundingClientRect().top -
              top
          }
        }))
        .reduce(
          (acc, curr) => ({
            ...acc,
            [curr.filename]: curr
          }),
          {}
        );
    };

    const drawableBackbones: Record<string, DrawableBackbone> = defineDrawableBackbones();

    const uniqueFileNames = Object.keys(drawableBackbones);

    const drawBackbones = () => {
      let index = -1;

      const chunkSize = 3;

      const drawChunk = () => {
        if (index < uniqueFileNames.length - chunkSize) {
          setTimeout(drawChunk);
        }

        do {
          index++;
          const filename = uniqueFileNames[index];

          if (!filename) break;

          const { rect, color } = drawableBackbones[filename];

          const height = rect.bottom - rect.top + MARKER_HEIGHT;
          const topOffset = rect.top - prevHeight;

          this.drawBackbone(height, color, topOffset, index, filename);

          prevHeight += height;
        } while (index % chunkSize !== 0);
      };
      drawChunk();
    };

    const drawRibs = () => {
      const container = this.renderer.createElement('div');
      this.renderer.addClass(container, 'bind-ribs');

      this.hostElement.appendChild(container);

      let index = -1;
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

          const { filename } = childs[index].dataset;

          if (!drawableBackbones[filename]) {
            const emptyRib = this.createBindRib(uniqueFileNames.length * MARKER_OFFSET);
            container.appendChild(emptyRib);
            continue;
          }

          const width =
            (uniqueFileNames.length - uniqueFileNames.indexOf(filename) + 1) * MARKER_OFFSET;
          const { color } = drawableBackbones[filename];

          const rib = this.createBindRib(width, color);

          container.appendChild(rib);
        } while (index % chunkSize !== 0);

        this.endDraw.emit();
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
