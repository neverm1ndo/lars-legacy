import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, NgZone, ChangeDetectionStrategy, OnDestroy, Input } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import Stats from 'three/examples/jsm/libs/stats.module';

import { from, concat, Observable, BehaviorSubject, of, fromEvent } from 'rxjs';
import { catchError, map, switchMap, take, tap, mergeMap } from 'rxjs/operators';
import { GUI } from 'dat.gui';
import { getObjectNameById } from '../sa.objects';

import { MapObject } from '../map.interfaces';
import { MathUtils } from 'three';

import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader";

import { faSave, faUndo, faRedo, faMap, faCloudDownloadAlt, faCloudUploadAlt, faList } from '@fortawesome/free-solid-svg-icons';
import { ElectronService } from '@lars/core/services';
import * as path from 'path';
import { MapsService } from '../maps.service';
import { IOutputAreaSizes } from 'angular-split';
import { PanesService } from '@lars/shared/panes.service';
import { MapInspectorComponent } from '../map-inspector/map-inspector.component';


enum COLOR {
  RED   = 0xFF0000,
  GREEN = 0x00FF00,
  BLUE  = 0x0000FF,
  BLACK = 0x000000,
  WHITE = 0xFFFFFF,
  WATER = 0x4785A9,
  SKY   = 0xBBF2FF,
}

interface ResourcesPackSettings {
  protocol: string;
  host: string;
  textures: string;
}

@Component({
  selector: 'map-editor-v2',
  templateUrl: './map-editor-v2.component.html',
  styleUrls: ['./map-editor-v2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapEditorV2Component implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('view', { static: true }) private _canvas: ElementRef<HTMLCanvasElement>;
  
  @ViewChild(MapInspectorComponent) private _inspector!: MapInspectorComponent;
  
  @Input('map') private set _mapObjects(objects: MapObject[]) {
    const clean = objects.filter((object) => object.name == 'object' && object.model);
    this.$mapObjects.next(clean);
  };

  public $mapObjects: BehaviorSubject<MapObject[]> = new BehaviorSubject(null);

  public $loading: BehaviorSubject<boolean> = new BehaviorSubject(true);

  private _FOV: number = 80;
  private _nearClippingPlane: number = 1;
  private _farClippingPlane: number = 500;
  private _camera!: THREE.PerspectiveCamera;
  private _controls: OrbitControls;

  private _resizeObserver: ResizeObserver = new ResizeObserver((_entries: ResizeObserverEntry[]) => {
    
    this.canvas.style.width = this.canvas.parentElement.parentElement.clientWidth + 'px';
    this.canvas.style.height = this.canvas.parentElement.parentElement.clientHeight + 'px';
    
    this._camera.aspect = this._getAspectRatio();
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this._labelRenderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  });

  private get canvas(): HTMLCanvasElement {
    return this._canvas.nativeElement;
  }

  private _renderer!: THREE.WebGLRenderer;
  private _labelRenderer: CSS2DRenderer = new CSS2DRenderer();
  
  private _scene!: THREE.Scene;

  private _loadingManager: THREE.LoadingManager = new THREE.LoadingManager();
  private _objectLoader: OBJLoader = new OBJLoader(this._loadingManager);
  private _mtlLoader: MTLLoader = new MTLLoader(this._loadingManager);

  private _stats: Stats = Stats();
  private _gui: GUI = new GUI();

  private _clock: THREE.Clock = new THREE.Clock();
  private _limiter: boolean = true;

  private _loadedTerrainChunks: Map<string, THREE.Group> = new Map();
  private _terrainBoundingBoxes: Map<string, THREE.Box3> = new Map();

  public loadedMapGroup: THREE.Group = new THREE.Group();

  private _cursorRayCaster: THREE.Raycaster = new THREE.Raycaster();
  private _pointer: THREE.Vector2 = new THREE.Vector2();

  public selectedMapObject: THREE.Mesh = new THREE.Mesh();

  private _outlinePass: OutlinePass;
  private _composer: EffectComposer; 
  private _renderPass: RenderPass;
  private _effectFXAA: ShaderPass;

  private readonly _resourcesPackSettings: ResourcesPackSettings = this._loadResouresPackSettings();

  private readonly _mapChunksNames: string[] = [
    'countryE', 
    'countryW', 'countrys', 'countryN', 
    /** Not prepared: 'countN2', */
    // 'SFs', 'SFse', 'SFe', 'SFw', 'SFn',
    // 'LAhills', 'LAw2', 'LAwn', 'LAw', 'LAe', 'LAe2', 'LAs', 'LAs2', 'LAn', 'LAn2',
    // 'vegasN', 'vegasE', 'vegasS', 'vegasW',
  ];

  public fa = {
    save: faSave,
    undo: faUndo,
    redo: faRedo,
    map: faMap,
    download: faCloudDownloadAlt,
    upload: faCloudUploadAlt,
    list: faList,
  };

  public paneStates: number[] = this._getPanesState();

  constructor(
    private _host: ElementRef,
    private _zone: NgZone,
    private _electron: ElectronService,
    private _maps: MapsService,
    private _panes: PanesService,
  ) {}

  public savePanesState(event: { gutterNum: number | '*', sizes: IOutputAreaSizes }): void {
    this._panes.savePanesState(event, 'lars/ui/panes/med');
  }

  private _getPanesState(): number[] {
    return this._panes.getPanesState('lars/ui/panes/med');
  }

  private _loadResouresPackSettings(): ResourcesPackSettings {
    const resourcesStorageItem: string = 'lars/maps/resourcesURI';
    try {
      const settings = localStorage.getItem(resourcesStorageItem);
      if (!settings) throw new Error('[ME] Resource pack settings is empty');

      return JSON.parse(settings) as ResourcesPackSettings;
    } catch (err) {
      console.warn(err);
      
      const defaultSettings: ResourcesPackSettings = {
        protocol: 'file',
        host: '',
        textures: 'txd_in',
      } as const;

      localStorage.setItem(resourcesStorageItem, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
  }

  private _showDebugGUI(): void {
    const createFolder = (name: string, fields: any[][], folder?: any) => {
      if (!folder) folder = this._gui.addFolder(name);
            fields.forEach((args: any[]) => {
                    folder.add(...args).listen();
                  });
            // folder.open();
      return folder;
    }

    createFolder('Chunks', [
      [this._loadedTerrainChunks, 'size', 0, this._mapChunksNames.length],
      [this.loadedMapGroup.children, 'length', 0, this._mapChunksNames.length + 2],
    ]);
    createFolder('Camera',
      ['x', 'y', 'z'].map((axis: string) => [this._camera.position, axis])
    );
    const renderer = this._gui.addFolder('Renderer');
    createFolder('Memory', ['geometries', 'textures'].map((type: string) => [this._renderer.info.memory, type]), renderer);
    createFolder('Render', [[this._renderer.info.render, 'triangles'], [this, '_limiter']], renderer);
  }

  private _handleMouseEvents(): void {
    fromEvent<MouseEvent>(this.canvas, 'click').subscribe({
      next: (event: MouseEvent) => {
        var rect = this._renderer.domElement.getBoundingClientRect();
        this._pointer.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
        this._pointer.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
        this._handleRaycasterIntersectMapObjects();
      },
    });
    fromEvent<MouseEvent>(this.canvas, 'contextmenu').subscribe({
      next: (event: MouseEvent) => {
        this._removeSelectionOfSelectedMapObject();
      },
    });
  }

  private _handleRaycasterIntersectMapObjects(): void {
    this._camera.updateMatrixWorld();
    this._cursorRayCaster.setFromCamera(this._pointer, this._camera);
    const intersects = this._cursorRayCaster.intersectObjects(this.loadedMapGroup.children);

    
    if (intersects.length === 0) return;
    
    let intersected = intersects[0].object;

    if (this.selectedMapObject.uuid !== (intersected as THREE.Object3D).uuid) {
      this._removeAllObjectChildrens(this.selectedMapObject);
      (this.selectedMapObject as any).material.color.set(0xffffff);
      this._focusObject(intersected);
    }
  }

  public focus(object: THREE.Object3D): void {
    if (this.selectedMapObject.uuid === object.uuid) return;
    this._removeAllObjectChildrens(this.selectedMapObject);
    this._focusObject(object);
  }

  private _focusObject(object: THREE.Object3D) {
    this.selectedMapObject = object as any;
    this._zone.run(() => {
      this._inspector.$selectedUUID.next(this.selectedMapObject.parent.uuid);
    });

    const intersectedObjectDiv = this._createTextLabel(`${object.parent.userData.id}\n(${object.parent.userData.model})`);

    const intersectedObjectLabel: CSS2DObject = new CSS2DObject(intersectedObjectDiv);
          intersectedObjectLabel.position.set(this.selectedMapObject.position.x, this.selectedMapObject.position.y, this.selectedMapObject.position.z);
          this.selectedMapObject.add(intersectedObjectLabel);
    
    intersectedObjectLabel.layers.set(0);

    // this._outlinePass.selectedObjects = [this.selectedMapObject];
  }

  private _createTextLabel(text: string): HTMLDivElement {
    const intersectedObjectDiv: HTMLDivElement = document.createElement('div');
          intersectedObjectDiv.className = 'label';
          intersectedObjectDiv.textContent = text;
          intersectedObjectDiv.style.backgroundColor = 'transparent';
          intersectedObjectDiv.style.whiteSpace = 'pre-wrap';
          intersectedObjectDiv.style.textAlign = 'center';
    return intersectedObjectDiv;
  }

  private _removeAllObjectChildrens(object: THREE.Object3D) {
    for (let children of object.children) object.remove(children);
  }

  private _loadModelFromFileSystem(name: string): Observable<THREE.Group> {
    const { protocol, host, textures } = this._resourcesPackSettings;
    const resourcesPackURI: string = encodeURI(`${protocol}://${host}${textures}`);
    return from<Promise<string>>(this._electron.ipcRenderer.invoke('model', path.join(host, `${name}.mtl`)))
          .pipe(
            map((buffer: string) => this._mtlLoader.setResourcePath(resourcesPackURI).parse(buffer, '')),
            map((materials: MTLLoader.MaterialCreator) => {
              materials.preload();
              materials.getAsArray()
                       .forEach((material: THREE.Material) => {
                          material.transparent = true;
                          material.alphaTest = 0.5;
                        });
              return materials;
            }),
            switchMap((materials: MTLLoader.MaterialCreator) => 
              from(this._electron.ipcRenderer.invoke('model', path.join(host, `${name}.obj`)))
                                             .pipe(
                                                map((buffer: Buffer) => this._objectLoader.setMaterials(materials)
                                                                                          .parse(buffer.toString()))
                                              )
            ),
            catchError(() => of(this._makeErrorBox())),
            map((group: THREE.Group) => {
              group.name = name;
              return group;
            }),
          );
  };

  private _removeSelectionOfSelectedMapObject() {
    this._removeAllObjectChildrens(this.selectedMapObject);
    this._outlinePass.selectedObjects = [];
    (this.selectedMapObject as any).material.color.set(0xffffff);
    this.selectedMapObject = new THREE.Mesh();
  }

  /**
   * TODO: merge with _loadObjectFromFileSystem
   * @param name 
   * @returns 
   */
  private _fetchObjectFromServer(name: string): Observable<THREE.Group> {
    if (!name) return of(this._makeErrorBox());
    return from(this._mtlLoader.setPath('/assets/sa_map/')
                               .setResourcePath('/assets/sa_map/textures')
                               .loadAsync(`${name}.mtl`))
          .pipe(
            catchError(() => of(this._makeErrorBox())),
            map((materials: MTLLoader.MaterialCreator) => {
              materials.preload();
              materials.getAsArray()
                       .forEach((material: THREE.Material) => {
                          material.transparent = true;
                          material.alphaTest = 0.5;
                        });
              return materials;
            }),
            switchMap((materials: MTLLoader.MaterialCreator) =>
              from(this._objectLoader.setPath('/assets/sa_map/')
                                     .setMaterials(materials)
                                     .loadAsync(`${name}.obj`))),
            catchError(() => of(this._makeErrorBox())),
            map((group: THREE.Group) => {
              group.name = name;
              return group;
            })
          );
  }

  /**
  * @param {string} name object/terrain chunk name
  * @returns {Observable<[THREE.Group, string]>}
  * Load map chunk by name
  */
  private _loadMapChunk(name: string): Observable<[THREE.Group, string]> {
    return this._loadModelFromFileSystem(name)
               .pipe(
                  map((group: THREE.Group) => [group, name]),
               );
  }

  /**
  * Removes all map objects from scene
  */
  private _unloadMapObjects(): void {
    this._scene.remove(...this._mapObjects.map((object: MapObject) => this._scene.getObjectByName(object.name)));
    this._mapObjects = [];
  }

  /**
  * @returns {Observable<[THREE.Group, string]>}
  * Load map objects one by one from *.map file
  */
  private _loadMapObjects(): Observable<[THREE.Group, string]> {
    return concat(...this._mapObjects.map((object: MapObject) => this._loadMapChunk(this._getMapObjectNameById(object.id))))
          .pipe(take(this._mapObjects.length))
  }

  /**
  * @param {(string|number)} id map object id
  * @returns {string} object name, same as in gta3.img
  */
  private _getMapObjectNameById(id: string | number): string {
    return getObjectNameById(id.toString());
  }

  /**
  * Adds light, fog, terrain chunks and camera
  */
  private _createScene(): void {
    this._labelRenderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this._labelRenderer.domElement.style.position = 'absolute';
    this._labelRenderer.domElement.style.top = '0px';
    this._labelRenderer.domElement.style.pointerEvents = 'none';
    this._labelRenderer.domElement.style.fontSize = '12px';
		
    this._host.nativeElement.appendChild(this._labelRenderer.domElement);


    const light = new THREE.AmbientLight(COLOR.WHITE, 1);
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(COLOR.SKY);
    this._scene.add(light);

    this._scene.fog = new THREE.Fog(COLOR.SKY, this._farClippingPlane - 150, this._farClippingPlane);

    const _loadMapChunks: Observable<[THREE.Group, string]> = this.__loadMapChunks()
    .pipe(
      tap(([chunk, name]) => {
        chunk.name = name;
        this._loadedTerrainChunks.set(name, chunk);

        const box = new THREE.Box3().setFromObject(chunk);
        const newMin = new THREE.Vector3(box.min.x-500, box.min.y-100, box.min.z-500);
        const newMax = new THREE.Vector3(box.max.x+500, box.max.y+300, box.max.z+500);
              box.set(newMin, newMax);

        this._terrainBoundingBoxes.set(name, box);
      }),
    );

    _loadMapChunks.pipe(
      mergeMap(() => this.__loadMapObjects())
    )
    .subscribe({
      next: (group) => {
        this.loadedMapGroup.add(group);

        if (this.loadedMapGroup.children.length !== this.$mapObjects.value.length) return; 
        this._scene.add(this.loadedMapGroup);
        this.__setCameraLookAtInitialMapObject();
        
        this._inspector.$objects.next(this.loadedMapGroup);

        this._zone.run(() => {
          this.$loading.next(false);
        });

        this._maps.mapGroupToXML(this.loadedMapGroup);
      
      },
      error: console.error,
      complete: () => {
        console.log('complete');
      }
    });
    

    const ASPECT_RATIO: number = this._getAspectRatio();
    this._camera = new THREE.PerspectiveCamera(this._FOV, ASPECT_RATIO, this._nearClippingPlane, this._farClippingPlane);
    this._camera.position.y = this._farClippingPlane - 150;
    this._camera.far = this._farClippingPlane;
    this._camera.near = this._nearClippingPlane;

    /** Helpers */
    const axesHelper = new THREE.AxesHelper(50);
    this._scene.add(axesHelper);
  }

  private __loadMapObjects(): Observable<THREE.Group> {
    return this.$mapObjects.pipe(
      tap(() => {
        this._removeAllObjectChildrens(this.selectedMapObject);
        this.loadedMapGroup.clear();
      }),
      switchMap((objects: MapObject[]) => this._fetchMapObjects(objects)),
    );
  }

  private __setCameraLookAtInitialMapObject(): void {
    const [initialObject] = this.loadedMapGroup.children;
    const { x, y, z } = initialObject.position;

    this._camera.position.set(x + 10, y + 10, z + 10);
    this._camera.lookAt(x, y, z);
    this._controls.target.set(x, y, z);
  }

  private __loadMapChunks() {
    const chunks = this._mapChunksNames.map((name: string) => this._loadMapChunk(name));
    return concat(...chunks).pipe(take(chunks.length));
  }

  /**
  * @returns {number} canvas aspect ratio
  */
  private _getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
  * Checks if the camera position belongs to the terrain bounding box
  */
  private _chunkBoundingContainsCamera(): void {
    const boxes = Array.from(this._terrainBoundingBoxes.entries());
    for (let box of boxes) {
      const [ name, bounding ] = box;
      if (bounding.containsPoint(this._camera.position)) this._scene.add(this._loadedTerrainChunks.get(name));
      else this._scene.remove(this._loadedTerrainChunks.get(name));
    }
  }

  /**
  * - Defines WebGL2 renderer,
  * - Attaches controls to camera,
  * - Initiates GUI box,
  * - Initiates update functions,
  */
  private _renderingLoop(): void {
    this._renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: false, powerPreference: 'high-performance', });
    
    console.log('WebGL2 capability:', this._renderer.capabilities.isWebGL2);
    
    this._renderer.setPixelRatio(devicePixelRatio);
    this._renderer.outputEncoding = THREE.sRGBEncoding;
    this._renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    /** Shader effect */
    /** Composer */
    this._composer = new EffectComposer(this._renderer);
    this._composer.setPixelRatio(devicePixelRatio);

    /** Render pass */
    this._renderPass = new RenderPass(this._scene, this._camera);
    
    /** Outline pass */
    this._outlinePass = new OutlinePass(
      new THREE.Vector2(this.canvas.clientWidth, this.canvas.clientHeight),
      this._scene,
      this._camera
    );

    this._outlinePass.renderToScreen = true;
    
    this._outlinePass.edgeStrength = 10.0;
    this._outlinePass.edgeGlow = 0;
    this._outlinePass.edgeThickness = 1;
    this._outlinePass.pulsePeriod = 0;

    this._outlinePass.oldClearAlpha = 0;
    this._outlinePass.usePatternTexture = false;
    this._outlinePass.visibleEdgeColor.set(COLOR.RED);
    this._outlinePass.hiddenEdgeColor.set(COLOR.BLUE);

    // Shader fxaa
    this._effectFXAA = new ShaderPass(FXAAShader);
    this._effectFXAA.uniforms.resolution.value.set(
      1 / window.innerWidth,
      1 / window.innerHeight
    );
    this._effectFXAA.renderToScreen = true;

    const gammaCorrectionPass: ShaderPass = new ShaderPass(GammaCorrectionShader);

    /** Composer passes */

    this._composer.addPass(this._effectFXAA);
    this._composer.addPass(this._renderPass);

    /** Causes perfomance issues */
    // this._composer.addPass(this._outlinePass);
    // this._composer.addPass(gammaCorrectionPass);

    /** Controls */

    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    this._controls.enableDamping = true;

    this._showDebugGUI();

    this._host.nativeElement.appendChild(this._stats.dom);

    this._update();
  }

  private _update(): void {
    const FPS_LIMIT: number = 60;
    let DELTA: number = 0;
    let INTERVAL: number = 1/FPS_LIMIT;

    const render = (): void => {
      requestAnimationFrame(render);

      DELTA += this._clock.getDelta();

      if (DELTA > INTERVAL) {
        this._controls.update();
        
        if (this._terrainBoundingBoxes.size == this._mapChunksNames.length) this._chunkBoundingContainsCamera();

        this._labelRenderer.render(this._scene, this._camera);
        this._composer.render();
        
        this._stats.update();
        if (this._limiter) DELTA = DELTA % INTERVAL;
      }
    };
    render();
  }

  private _makeErrorBox(): THREE.Group {
    const box = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: COLOR.RED });
    const group = new THREE.Group();
          group.add(new THREE.Mesh(box, material));
          group.name = 'error_box';
    return group;
  }

  private _fetchMapObjects(clean: MapObject[]): Observable<THREE.Group> {

    const objectsToLoad: Observable<THREE.Group>[] = clean.map(
      (object: MapObject) => this._loadModelFromFileSystem(this._getMapObjectNameById(object.model))
        .pipe(
          map((group: THREE.Group) => {
          
            group.position.set(object.posX, object.posZ, -object.posY);
            
            group.userData.id = object.id;
            group.userData.dimension = object.dimension;

            group.userData.objectType = object.name;
            group.userData.model = object.model;
            group.userData.interior = object.interior;

            const rotation: number[] = [object.rotX, object.rotZ, object.rotY].map((deg: number) => MathUtils.degToRad(deg)) as number[];

            group.rotation.set(...rotation as [number, number, number]);
            return group;
        })));
    
    return concat(...objectsToLoad).pipe(
      take(clean.length),
      tap((group: THREE.Group) => {
        group.userData.initial = true;
        this.loadedMapGroup.add(group);
      })
    );
  }

  public debugMap() {
    this._maps.mapGroupToXML(this.loadedMapGroup);
  }

  private __destroyGUI(): void {
    if (this._gui) this._gui.destroy();
    this._stats.end();
  }

  ngAfterViewInit(): void {
    (document.body.querySelector('.dg.ac') as HTMLElement).style.top = '40px';
    this._zone.runOutsideAngular(() => {
      this._createScene();
      this._renderingLoop();
      this._resizeObserver.observe(this.canvas.parentElement.parentElement);
      this._handleMouseEvents();
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    /** Unload objects and textures */
    this._objectLoader   = null;
    this._mtlLoader      = null;
    this._loadingManager = null;

    /** Clear chunk maps */
    this._terrainBoundingBoxes.clear();
    this._loadedTerrainChunks.clear();

    /** Dispose renderer */
    this._scene.remove(...this._scene.children);
    this._renderer.dispose();
    this._renderer.forceContextLoss();

    /** Destroy GUI */
    this.__destroyGUI();
  }
}
