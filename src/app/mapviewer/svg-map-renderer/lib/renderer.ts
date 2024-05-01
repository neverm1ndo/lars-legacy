import { ElementRef } from '@angular/core';
import { MapObject, ViewerColntrolMode } from '@lars/mapviewer/domain/entities';
import { BehaviorSubject, map, Subscription, withLatestFrom } from 'rxjs';

const SVG_NS = 'http://www.w3.org/2000/svg';
const MAP_SIZE = 6000;

type Position2 = [number, number];

export class SVGRenderer {
  constructor(private readonly container: ElementRef) {}

  private resources: Record<string, SVGImageElement> = {};

  private viewport: SVGSVGElement;

  private zoom = new BehaviorSubject<number>(0.1);
  private subsriptions = new Subscription();
  viewportOffset = new BehaviorSubject<Position2>([0, 0]);
  mode: BehaviorSubject<ViewerColntrolMode> = new BehaviorSubject(ViewerColntrolMode.NONE);

  get viewportContainer() {
    return this.viewport;
  }

  get modeValue() {
    return this.mode.getValue();
  }

  get zoomValue() {
    return this.mode.getValue();
  }

  private async load(
    sources: { src: string; name: string }[]
  ): Promise<Record<string, SVGImageElement>> {
    try {
      const resources = {};

      for (const source of sources) {
        const image = document.createElementNS(SVG_NS, 'image');
        image.setAttribute('href', source.src);

        await new Promise<void>((resolve) => {
          image.onload = () => resolve();
        });

        resources[source.name] = image;
      }

      return resources;
    } catch (err) {
      console.error(err);
    }
  }

  private create() {
    const container: HTMLElement = this.container.nativeElement;
    this.viewport = this.createElement('svg');

    this.set(this.viewport, {
      version: '1.1',
      xmlns: SVG_NS,
      lars: ''
    });

    this.viewport.classList.add('lars_map');

    const { clientWidth, clientHeight } = container;
    this.viewport.setAttribute('viewBox', [0, 0, clientWidth, clientHeight].join(' '));
    // this.viewportOffset.subscribe({
    //   next: ([offsetX, offsetY]) =>
    //     this.viewport.setAttribute(
    //       'viewBox',
    //       [offsetX, offsetY, clientWidth, clientHeight].join(' ')
    //     )
    // });

    container.appendChild(this.viewport);

    this.drawDebugShapes();
  }

  private drawMap() {
    const mapImage = this.resources.map;
    const size = MAP_SIZE.toString();

    this.set(mapImage, {
      width: size,
      height: size
    });

    this.zoom.subscribe((zoom) => {
      mapImage.style.scale = zoom.toString();
    });

    this.viewportOffset
      .pipe(
        withLatestFrom(this.zoom),
        map(([pos, zoom]) => pos.map((axis) => String(-axis / zoom)))
      )
      .subscribe(([x, y]) => {
        this.set(mapImage, { x, y });
      });

    this.viewport.prepend(mapImage);
  }

  private drawDebugShapes() {
    const debugGroup = this.createElement('g');
    const origin = this.createElement('circle');

    this.set(debugGroup, { stroke: 'crimson', 'stroke-width': '5', fill: 'transparent' });
    this.set(origin, {
      cx: (this.viewport.clientWidth / 2).toString(),
      cy: (this.viewport.clientHeight / 2).toString(),
      r: '5'
    });

    debugGroup.appendChild(origin);

    this.viewport.appendChild(debugGroup);
  }

  async init(options: { resources: { name: string; src: string }[] }) {
    return this.load(options.resources).then((resources) => {
      this.resources = resources;

      this.create();
      this.drawMap();
    });
  }

  setZoom(zoom: number) {
    this.zoom.next(zoom * 0.1);
  }

  createElement<T extends keyof SVGElementTagNameMap>(quelifiedName: T): SVGElementTagNameMap[T];
  createElement(quelifiedName: string) {
    return document.createElementNS(SVG_NS, quelifiedName);
  }

  private set<T extends SVGElement>(element: T, properties: Record<string, string>): void {
    for (const [property, value] of Object.entries(properties)) {
      element.setAttribute(property, value);
    }
  }

  setObjects(objects: MapObject[]) {}

  setViewportSize() {}

  lookAt() {}

  removeObject() {}

  addObject() {}

  selectObject() {}

  dispose() {
    this.zoom.complete();
    this.viewportOffset.complete();
    this.subsriptions.unsubscribe();
  }
}
