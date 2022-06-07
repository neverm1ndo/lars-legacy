import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, NgZone, ChangeDetectionStrategy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import { from, concat, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
export class MapEditorV2Component implements OnInit, AfterViewInit {

  @ViewChild('view', { static: true }) private _canvas: ElementRef<HTMLCanvasElement>;

  // @HostListener('window:resize', ['$event']) onResize() {
  //   this._zone.runOutsideAngular(() => {
  //     this._canvas.nativeElement.width = this._host.nativeElement.offsetWidth;
  //     this._canvas.nativeElement.height = this._host.nativeElement.offsetHeight;
  //   });
  // }

  private _FOV: number = 80;
  private _nearClippingPlane: number = 1;
  private _farClippingPlane: number = 300;

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
  // private _frustum: THREE.Frustum = new THREE.Frustum();

  // private _mapChunks: {[key: string]: THREE.Group} = {};
  private _loadedChunks: Map<string, THREE.Group> = new Map();
  private _mapChunksNames: string[] = [
    'LAhills',
    'SFs',
    'SFse',
    'SFe',
    'SFw',
    'SFn',
    'countryE',
    'countryW',
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

  private addWaterToScene(): void {
    const geometry = new THREE.PlaneGeometry(2000, 2000, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: COLOR.WATER });
    const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(0, -1, 0);
          mesh.rotation.set(-Math.PI/2, 0, 0);
    this._scene.add(mesh);
  }

  private showDebugGUI(): void {
    const chunksLoaded = this._gui.addFolder('Chunks');
    chunksLoaded.add(this._scene.children, 'length', 0, this._mapChunksNames.length).listen();
    chunksLoaded.open();
    const cameraPosition = this._gui.addFolder('Camera');
    cameraPosition.add(this._camera.position, 'x').listen();
    cameraPosition.add(this._camera.position, 'y').listen();
    cameraPosition.add(this._camera.position, 'z').listen();
    cameraPosition.open();
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

  private createScene(): void {
    const light = new THREE.AmbientLight(COLOR.WHITE, 1);
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(COLOR.SKY);
    this._scene.add(light);

    this._scene.fog = new THREE.Fog(COLOR.SKY, this._farClippingPlane - 150, this._farClippingPlane);

    // this.addWaterToScene();

    concat(...this._mapChunksNames.map((name: string) => this.loadMapChunk(name)))
    .subscribe(([chunk, name]) => {
      chunk.name = name;
      // this._mapChunks[name] = chunk;
      console.log(chunk);
      this._loadedChunks.set(name, chunk);
      this._scene.add(chunk);
    });

    const ASPECT_RATIO: number = this.getAspectRatio();
    this._camera = new THREE.PerspectiveCamera(this._FOV, ASPECT_RATIO, this._nearClippingPlane, this._farClippingPlane);
    this._camera.position.y = this._farClippingPlane - 150;

    this.showDebugGUI();

    const axesHelper = new THREE.AxesHelper(50);
    this._scene.add(axesHelper);
  }

  private getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private renderingLoop(): void {
    this._renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: false, powerPreference: "high-performance", });
    console.log('WebGL2 capability:', this._renderer.capabilities.isWebGL2);
    this._renderer.setPixelRatio(0.9);
    this._renderer.outputEncoding =  THREE.sRGBEncoding;
    this._renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    this._controls.enableDamping = true;

    this._host.nativeElement.appendChild(this._stats.dom);
    const render = (): void => {
      requestAnimationFrame(render);
      this._controls.update();
      this._renderer.render(this._scene, this._camera);
      this._stats.update();
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

}
