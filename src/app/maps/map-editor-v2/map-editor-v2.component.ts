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

import { outlineMaterial } from '@lars/shared/materials/outline.material';

import { faSave, faUndo, faRedo, faMap, faCloudDownloadAlt, faCloudUploadAlt, faList } from '@fortawesome/free-solid-svg-icons';
import { ElectronService } from '@lars/core/services';
import * as path from 'path';
import { MapsService } from '../maps.service';

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
  @Input('map') private set _mapObjects(objects: MapObject[]) {
    const clean = objects.filter((object) => object.name == 'object' && object.model);
    this.$mapObjects.next(clean);
  };

  private $mapObjects: BehaviorSubject<MapObject[]> = new BehaviorSubject(null);

  public $loading: BehaviorSubject<boolean> = new BehaviorSubject(true);

  private _FOV: number = 80;
  private _nearClippingPlane: number = 1;
  private _farClippingPlane: number = 500;
  private _camera!: THREE.PerspectiveCamera;
  private _controls: OrbitControls;

  private _resizeObserver: ResizeObserver = new ResizeObserver((_entries: ResizeObserverEntry[]) => {
    
    this.canvas.style.width = this._host.nativeElement.clientWidth + 'px';
    this.canvas.style.height = this._host.nativeElement.clientHeight - 28 + 'px';
    
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

  private _layers = [];

  private _loadingManager: THREE.LoadingManager = new THREE.LoadingManager();
  private _objectLoader: OBJLoader = new OBJLoader(this._loadingManager);
  private _mtlLoader: MTLLoader = new MTLLoader(this._loadingManager);

  private _stats: Stats = Stats();
  private _gui: GUI = new GUI();

  private _clock: THREE.Clock = new THREE.Clock();
  private _limiter: boolean = true;

  private _loadedTerrainChunks: Map<string, THREE.Group> = new Map();
  private _terrainBoundingBoxes: Map<string, THREE.Box3> = new Map();

  private _loadedMapGroup: THREE.Group = new THREE.Group();

  private _cursorRayCaster: THREE.Raycaster = new THREE.Raycaster();
  private _pointer: THREE.Vector2 = new THREE.Vector2();

  private _selectedMapObject: THREE.Mesh = new THREE.Mesh();

  private readonly _resourcesPackSettings: ResourcesPackSettings = this._loadResouresPackSettings();

  private readonly _mapChunksNames: string[] = [
    'countryE', 
    // 'countryW', 'countrys', 'countryN', 'countN2',
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

  constructor(
    private _host: ElementRef,
    private _zone: NgZone,
    private _electron: ElectronService,
    private _maps: MapsService,
  ) {}

  private _loadResouresPackSettings(): ResourcesPackSettings {
    try {
      const settings = localStorage.getItem('lars/maps/resourcesURI');
      if (!settings) throw new Error('[ME] Resource pack settings is empty');

      return JSON.parse(settings) as ResourcesPackSettings;
    } catch (err) {
      console.warn(err);
      return {
        protocol: 'file',
        host: '',
        textures: 'txd_in',
      };
    }
  }

  private _showDebugGUI(): void {
    const createFolder = (name: string, fields: any[][], folder?: any) => {
      if (!folder) folder = this._gui.addFolder(name);
            fields.forEach((args: any[]) => {
                    folder.add(...args).listen();
                  });
            folder.open();
      return folder;
    }

    createFolder('Chunks', [
      [this._loadedTerrainChunks, 'size', 0, this._mapChunksNames.length],
      [this._loadedMapGroup.children, 'length', 0, this._mapChunksNames.length + 2],
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
    const intersects = this._cursorRayCaster.intersectObjects(this._loadedMapGroup.children);

    
    if (intersects.length === 0) return;
    
    let intersected = intersects[0].object;

    if (this._selectedMapObject.uuid !== (intersected as THREE.Object3D).uuid) {
      this._removeAllObjectChildrens(this._selectedMapObject);
      (this._selectedMapObject as any).material.color.set(0xffffff);
      this._selectedMapObject = intersected as any;
      (this._selectedMapObject as any).material.color.set(0xff0000);

      const intersectedObjectDiv: HTMLDivElement = document.createElement('div');
            intersectedObjectDiv.className = 'label';
            intersectedObjectDiv.textContent = `${this._selectedMapObject.parent.userData.id}\n(${this._selectedMapObject.parent.userData.model})`;
            intersectedObjectDiv.style.backgroundColor = 'transparent';

      const intersectedObjectLabel: CSS2DObject = new CSS2DObject(intersectedObjectDiv);
            intersectedObjectLabel.position.set(this._selectedMapObject.position.x, this._selectedMapObject.position.y, this._selectedMapObject.position.z);
            this._selectedMapObject.add(intersectedObjectLabel);
            intersectedObjectLabel.layers.set(0);
    }
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
              from(this._electron.ipcRenderer.invoke('model', path.join(host, `${name}.obj`))).pipe(
                map((buffer: Buffer) => this._objectLoader.setMaterials(materials)
                                                          .parse(buffer.toString()))
              )
            ),
            catchError(() => of(this._makeErrorBox())),
            map((group: THREE.Group) => {
              group.name = name;
              return group;
            })
          );
  };

  private _removeSelectionOfSelectedMapObject() {
    this._removeAllObjectChildrens(this._selectedMapObject);
    (this._selectedMapObject as any).material.color.set(0xffffff);
    this._selectedMapObject = new THREE.Mesh();
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
        this._loadedMapGroup.add(group);

        if (this._loadedMapGroup.children.length !== this.$mapObjects.value.length) return; 
        this._scene.add(this._loadedMapGroup);
        this.__setCameraLookAtInitialMapObject();
        
        this._zone.run(() => {
          this.$loading.next(false);
        });

        this._maps.mapGroupToXML(this._loadedMapGroup);
      
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

    const axesHelper = new THREE.AxesHelper(50);
    this._scene.add(axesHelper);
  }

  private __loadMapObjects(): Observable<THREE.Group> {
    return this.$mapObjects.pipe(
      tap(() => {
        this._removeAllObjectChildrens(this._selectedMapObject);
        console.log(this._loadedMapGroup.children.length, 'removed');
        this._loadedMapGroup.clear();
      }),
      switchMap((objects: MapObject[]) => this._fetchMapObjects(objects)),
    );
  }

  private __setCameraLookAtInitialMapObject(): void {
    const [initialObject] = this._loadedMapGroup.children;
    const { x, y, z } = initialObject.position;

    this._camera.position.set(x + 10, z + 10, -y + 10);
    this._camera.lookAt(x, z, -y);
    this._controls.target.set(x, z, -y);
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
        this._renderer.render(this._scene, this._camera);
        this._labelRenderer.render(this._scene, this._camera);
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
            group.userData.type = object.name;
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
        this._loadedMapGroup.add(group);
      })
    );
  }

  public debugMap() {
    this._maps.mapGroupToXML(this._loadedMapGroup);
  }

  ngAfterViewInit(): void {
    (document.body.querySelector('.dg.ac') as HTMLElement).style.top = '40px';
    this._zone.runOutsideAngular(() => {
      this._createScene();
      this._renderingLoop();
      this._resizeObserver.observe(this._host.nativeElement);
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
    if (this._gui) this._gui.destroy();
    this._stats.end();
  }
}
