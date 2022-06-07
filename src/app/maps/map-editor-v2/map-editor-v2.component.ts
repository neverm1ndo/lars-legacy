import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, NgZone, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import { from, concat, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { GUI } from 'dat.gui';

enum COLOR {
  RED = 0xFF0000,
  GREEN = 0x00FF00,
  BLUE = 0x0000FF,
  BLACK = 0x000000,
  WHITE = 0xFFFFFF,
  WATER = 0x4785A9,
  SKY = 0xBBF2FF
}

@Component({
  selector: 'map-editor-v2',
  templateUrl: './map-editor-v2.component.html',
  styleUrls: ['./map-editor-v2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapEditorV2Component implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('view', { static: true }) private _canvas: ElementRef<HTMLCanvasElement>;

  // @HostListener('window:resize', ['$event']) onResize() {
  //   this._zone.runOutsideAngular(() => {
  //     this._canvas.nativeElement.width = this._host.nativeElement.offsetWidth;
  //     this._canvas.nativeElement.height = this._host.nativeElement.offsetHeight;
  //   });
  // }

  private _FOV: number = 80;
  private _nearClippingPlane: number = 1;
  private _farClippingPlane: number = 500;

  private _camera!: THREE.PerspectiveCamera;
  private get canvas(): HTMLElement {
    return this._canvas.nativeElement;
  }
  private _renderer!: THREE.WebGLRenderer;
  private _scene!: THREE.Scene;
  private _loadingManager: THREE.LoadingManager = new THREE.LoadingManager();
  private _objectLoader: OBJLoader = new OBJLoader(this._loadingManager);
  private _mtlLoader: MTLLoader = new MTLLoader(this._loadingManager);
  private _stats: Stats = Stats();
  private _controls: OrbitControls;
  private _gui: GUI = new GUI();
  private _clock: THREE.Clock = new THREE.Clock();
  private _limiter: boolean = true;

  private _loadedChunks: Map<string, THREE.Group> = new Map();
  private _boundingBoxes: Map<string, THREE.Box3> = new Map();
  private _cameraBoundingBox3: THREE.Box3 = new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(500, 500, 500));

  private readonly _mapChunksNames: string[] = [
    'countryE',
    'countryW',
    'LAhills',
    'SFs',
    'SFse',
    'SFe',
    'SFw',
    'SFn',
    'LAw2',
    'LAwn',
    'LAw',
    'LAe',
    'LAe2',
    'LAs',
    'LAs2',
    'LAn',
    'LAn2'
  ];

  constructor(
    private _host: ElementRef,
    private _zone: NgZone,
  ) { }

  // private addWaterToScene(): void {
  //   const geometry = new THREE.PlaneGeometry(2000, 2000, 1, 1);
  //   const material = new THREE.MeshStandardMaterial({ color: COLOR.WATER });
  //   const mesh = new THREE.Mesh(geometry, material);
  //         mesh.position.set(0, -1, 0);
  //         mesh.rotation.set(-Math.PI/2, 0, 0);
  //   this._scene.add(mesh);
  // }

  private showDebugGUI(): void {
    const chunksLoaded = this._gui.addFolder('Chunks');
          chunksLoaded.add(this._loadedChunks, 'size', 0, this._mapChunksNames.length).listen();
          chunksLoaded.add(this._scene.children, 'length', 0, this._mapChunksNames.length + 2).name('childrens').listen();
          chunksLoaded.open();
    const cameraPosition = this._gui.addFolder('Camera');
          cameraPosition.add(this._camera.position, 'x').listen();
          cameraPosition.add(this._camera.position, 'y').listen();
          cameraPosition.add(this._camera.position, 'z').listen();
          cameraPosition.open();
    const renderer = this._gui.addFolder('Renderer');
    const mem = renderer.addFolder('Memory');
          mem.add(this._renderer.info.memory, 'geometries').listen();
          mem.add(this._renderer.info.memory, 'textures').listen();
          mem.open();
    const render = renderer.addFolder('Render');
          render.add(this._renderer.info.render, 'triangles').listen();
          render.add(this, '_limiter').name('Frame limiter');
          render.open();
          renderer.open();
  }

  private loadMapChunk(name: string): Observable<[THREE.Group, string]> {
    return from(this._mtlLoader.setPath('/assets/sa_map/')
                               .setResourcePath('/assets/sa_map/textures')
                               .loadAsync(`${name}.mtl`))
          .pipe(map((materials: MTLLoader.MaterialCreator) => {
            materials.preload();
            materials.getAsArray().forEach((material: THREE.Material) => {
              material.transparent = true;
              material.alphaTest = 0.5;
            });
            return materials;
          }))
          .pipe(switchMap((materials: MTLLoader.MaterialCreator) =>
                          from(this._objectLoader.setPath('/assets/sa_map/')
                                                 .setMaterials(materials)
                                                 .loadAsync(`${name}.obj`))))
          .pipe(map((group: THREE.Group) => [group, name]));
  }

  private addLine() {
    const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1000, 200, 750)]);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: COLOR.WHITE }));
    this._scene.add(line);
  }

  private createScene(): void {
    const light = new THREE.AmbientLight(COLOR.WHITE, 1);
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(COLOR.SKY);
    this._scene.add(light);

    this._scene.fog = new THREE.Fog(COLOR.SKY, this._farClippingPlane - 150, this._farClippingPlane);

    concat(...this._mapChunksNames.map((name: string) => this.loadMapChunk(name)))
    .pipe(take(this._mapChunksNames.length))
    .subscribe(([chunk, name]) => {
        chunk.name = name;
        this._loadedChunks.set(name, chunk);

        const box = new THREE.Box3().setFromObject(chunk);
        const newMin = new THREE.Vector3(box.min.x-500, box.min.y-100, box.min.z-500);
        const newMax = new THREE.Vector3(box.max.x+500, box.max.y+300, box.max.z+500);
              box.set(newMin, newMax);

        this._boundingBoxes.set(name, box);
        this._scene.add(new THREE.Box3Helper(box, new THREE.Color(COLOR.RED)));
      },
      (error) => console.error(error));

    const ASPECT_RATIO: number = this.getAspectRatio();
    this._camera = new THREE.PerspectiveCamera(this._FOV, ASPECT_RATIO, this._nearClippingPlane, this._farClippingPlane);
    this._camera.position.y = this._farClippingPlane - 150;
    this._camera.far = this._farClippingPlane;
    this._camera.near = this._nearClippingPlane;

    this._cameraBoundingBox3.translate(this._camera.position);
    this._scene.add(new THREE.Box3Helper(this._cameraBoundingBox3, new THREE.Color(COLOR.GREEN)));

    this.addLine();

    const axesHelper = new THREE.AxesHelper(50);
    this._scene.add(axesHelper);
  }

  private getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private checkBoundingBoxes(): void {
    const boxes = Array.from(this._boundingBoxes.entries());
    for (let i = 0; i < boxes.length; i++) {
      const bounding = boxes[i][1];
      const name = boxes[i][0];
      if (bounding.containsPoint(this._camera.position)) this._scene.add(this._loadedChunks.get(name));
      else this._scene.remove(this._loadedChunks.get(name));
    }
  }

  private renderingLoop(): void {
    this._renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: false, powerPreference: 'high-performance', });
    console.log('WebGL2 capability:', this._renderer.capabilities.isWebGL2);
    this._renderer.setPixelRatio(0.9);
    this._renderer.outputEncoding = THREE.sRGBEncoding;
    this._renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    this._controls.enableDamping = true;

    this.showDebugGUI();

    this._host.nativeElement.appendChild(this._stats.dom);

    this.update();
  }

  private update(): void {
    const FPS_LIMIT: number = 60;
    let DELTA: number = 0;
    let INTERVAL: number = 1/FPS_LIMIT;
    const render = (): void => {
      requestAnimationFrame(render);
      DELTA += this._clock.getDelta();
      if (DELTA > INTERVAL) {
        this._controls.update();
        if (this._boundingBoxes.size == this._mapChunksNames.length) this.checkBoundingBoxes();
        this._renderer.render(this._scene, this._camera);
        this._stats.update();
        if (this._limiter) DELTA = DELTA % INTERVAL;
      }
    };
    render();
  }

  ngAfterViewInit(): void {
    (document.body.querySelector('.dg.ac') as HTMLElement).style.top = '40px';
    this.createScene();
    this._zone.runOutsideAngular(() => {
      this.renderingLoop();
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._gui.destroy();
    this._renderer.dispose();
    this._renderer.forceContextLoss();
    this._stats.end();
  }
}
