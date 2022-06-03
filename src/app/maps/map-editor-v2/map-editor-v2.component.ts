import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener, NgZone, ChangeDetectionStrategy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import Stats from 'three/examples/jsm/libs/stats.module';

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

  private _FOV: number = 80;
  private _nearClippingPlane: number = 1;
  private _farClippingPlane: number = 800;
  private _cameraZ: number = 400;

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

  constructor(
    private _host: ElementRef,
    private _zone: NgZone,
  ) { }

  private addWaterToScene(): void {
    const geometry = new THREE.PlaneGeometry(20000, 20000, 100, 100);
    const material = new THREE.MeshBasicMaterial({ color: COLOR.WATER });
    const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(0, -1, 0);
          mesh.rotation.set(-1.5708, 0, 0);
          mesh.receiveShadow = false;
          mesh.castShadow = false;
    this._scene.add(mesh);
  }

  private createScene(): void {
    const light = new THREE.AmbientLight(COLOR.WHITE, 1);
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(COLOR.SKY);
    this._scene.add(light);

    this._scene.fog = new THREE.Fog(COLOR.SKY, 600, 800);

    this.addWaterToScene();
    this._mtlLoader.setPath('/assets/sa_map/')
                   .setResourcePath('/assets/sa_map/textures')
                   .load('countryE.mtl', (materials: MTLLoader.MaterialCreator) => {
                     materials.preload();
                     this._objectLoader.setPath('/assets/sa_map/')
                                       .setMaterials(materials)
                                       .load('countryE.obj', (object) => {
                                          object.traverse((child: THREE.Object3D<THREE.Event>) => {
                                             if (Array.isArray((child as THREE.Mesh).material)) {
                                               ((child as THREE.Mesh).material as any[]).forEach(material => {
                                                 material.transparent = true;
                                                 material.alphaTest = 0.5;
                                               });
                                             };
                                          });
                                          this._scene.add(object);
                                       });
                   });
    const ASPECT_RATIO: number = this.getAspectRatio();
    this._camera = new THREE.PerspectiveCamera(this._FOV, ASPECT_RATIO, this._nearClippingPlane, this._farClippingPlane);
    // this._camera.position.z = this._cameraZ;
    this._camera.position.y = 500;

    const axesHelper = new THREE.AxesHelper(50);
    this._scene.add(axesHelper);
  }

  private getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private renderingLoop(): void {
    this._renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this._renderer.setPixelRatio(devicePixelRatio);
    // this._renderer.physicallyCorrectLights = true;
    this._renderer.outputEncoding =  THREE.sRGBEncoding;
    this._renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    this._controls.enableDamping = true;
    this._controls.maxPolarAngle = 0.5*Math.PI;
    this._controls.maxDistance = 1000;

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
    this.createScene();
    this._zone.runOutsideAngular(() => {
      this.renderingLoop();
    });
  }

  ngOnInit(): void {
  }

}
