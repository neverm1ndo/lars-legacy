import { Injectable } from '@angular/core';
import { ApiService } from '@lars/api.service';
import { ToastService } from '@lars/toast.service';
import { ElectronService } from '@lars/core/services';
import { MapObject } from './map.interfaces';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { filter, switchMap, take, catchError, map, tap } from 'rxjs/operators';
import { faInfo, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { Group, MathUtils } from 'three';
import { UserService } from '@lars/user.service';
import { MessageBoxReturnValue, SaveDialogReturnValue } from 'electron';

@Injectable()
export class MapsService {

  constructor(
    private _electron: ElectronService,
    private _api: ApiService,
    private _toast: ToastService,
    private _user: UserService,
  ) { }

  private _handleError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => error);
  }

  public mapGroupToXML(mapGroup: Group): XMLDocument {
    const xmlNamespaceURI: string = 'http://www.w3.org/1999/xhtml';
    const resultXML: XMLDocument = document.implementation.createDocument(xmlNamespaceURI, 'map', null);

    const map: Element = resultXML.querySelector('map');
          map.setAttribute('edf:definitions', 'editor_main');
    
    for (let object of mapGroup.children) {
      const objectElement: Element = resultXML.createElementNS(xmlNamespaceURI, object.userData.type);

      delete object.userData.type;
      delete object.userData.initial;
      
      for (let attribute in object.userData) {
        objectElement.setAttribute(attribute, object.userData[attribute]);
      }
      
      let { x: posX, y: posY, z: posZ } = object.position;
      let { x: rotX, y: rotY, z: rotZ } = object.rotation;

      [rotX, rotY, rotZ] = [rotX, rotY, rotZ].map((rad: number) => MathUtils.radToDeg(rad));

      const objectPositioning = { posX, posY, posZ, rotX, rotY, rotZ };
      
      for (let attribute in objectPositioning) {
        objectElement.setAttribute(attribute, objectPositioning[attribute]);
      }

      map.appendChild(objectElement);
    }

    const postComment: Comment = resultXML.createComment(`\n\tLARS gta-liberty.ru\n\tLast edited by ${this._user.loggedInUser$.value.username}\n\t${new Date().toISOString()}\n`);
    
    resultXML.append(postComment);

    return resultXML;
  }

  public async cancelChanges(path: string): Promise<any> {
    const dialogOpts = {
      type: 'warning',
      buttons: ['Да', 'Нет'],
      title: `Подтверждение отмены изменений`,
      message: `Есть несохраненные изменения в файле ${path}. Отменить все изменения?`
    };
    return this._electron.ipcRenderer.invoke('message-box', dialogOpts)
    .then(val => {
      if (val.response === 0) return Promise.resolve();
      return Promise.reject();
    });
  }

  private _isMapObjectTagAllowed(tagName: string) {
    const allowedElements: string[] = [
      'ped',
      'meta', // ???
      'object',
      'pickup',
      'vehicle',
      'material',
      'racepickup',
    ];

    for (let allowed of allowedElements) {
      if (allowed === tagName) return true;
    }
    return false;
  }

  public mapToObject(xml: string): MapObject[] {
    const parser: DOMParser = new DOMParser();
    const xmlfyRegex: RegExp = new RegExp(' (edf:)(.*")');
    const objects: MapObject[] = [];

    try {

      const map = parser.parseFromString(xml.replace(xmlfyRegex, ''), 'application/xml');
      
      const parseerror: Element = map.getElementsByTagName('parsererror')
                                     .item(0);
      
      if (parseerror) {
        const errormsgElement: Element = parseerror.children.item(1);
        throw new Error(`NOT_XML: ${errormsgElement.textContent}`);
      }
  
      const mapElement: Element = map.getElementsByTagName('map')
                                     .item(0);
      
      if (!mapElement) throw new Error('MAP_TAG_IS_MISSING: map tag is not exists in this document');
      
      const mapChildElements: HTMLCollection = mapElement.children;
      
      for (let i = 0; i < mapChildElements.length; i++) {
        const element: Element = mapChildElements[i];
  
        const { attributes, tagName } = element;
  
        if (!this._isMapObjectTagAllowed(tagName)) {
          console.warn(`NOT_ALLOWED_MAP_TAG: ${tagName} skip.`);
          continue;
        }
  
        let obj = { name: tagName };
        for (let i = 0; i < attributes.length; i++) {
  
          const attribute: Attr = attributes[i];
  
          const { name, value } = attribute;
  
          const float = parseFloat(value);
          obj[name] = !isNaN(float) ? float : value;
        }
  
        objects.push(obj);
      }
      return objects;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  public deleteMapCloud(path: string): Observable<unknown> {
    const dialogOpts = {
      type: 'warning',
      buttons: ['Удалить', 'Отмена'],
      title: `Подтверждение удаления`,
      message: `Вы точно хотите удалить карту ${path}? После подтверждения она будет безвозвратно удалена с сервера.`
    };
    return from(this._electron.ipcRenderer.invoke('message-box', dialogOpts))
                                          .pipe(
                                            filter((val: MessageBoxReturnValue) => val.response === 0),
                                            switchMap(() => this._api.deleteMap(path)),
                                            catchError((err) => this._handleError(err)),
                                            take(1),
                                          );
  }

  public saveMapCloud(path: string, group: Group): Observable<unknown> {
    const dialogOpts = {
      type: 'info',
      buttons: ['Сохранить', 'Отмена'],
      title: `Подтверждение сохранения на сервере`,
      message: `Вы точно хотите сохранить карту ${path}? После подтверждения она будет перезаписана на сервере.`
    };
    return from(this._electron.ipcRenderer.invoke('message-box', dialogOpts))
                                          .pipe(
                                            filter((val: MessageBoxReturnValue) => val.response === 0),
                                            map(() => {
                                              const form: FormData = new FormData();

                                              const xmlDocumentAsString: string = this.mapGroupToXML(group).toString();

                                              const blob: Blob = new Blob([xmlDocumentAsString], { type: 'application/xml' });
                                              form.append('file', blob, path);
                                              return form;
                                            }),
                                            switchMap((form: FormData) => this._api.uploadFileMap(form)),
                                            filter((event) => event instanceof HttpResponse),
                                            take(1),
                                          );
  }
  
  public saveMapLocal(name: string, group: Group): Observable<unknown> {
    const saveDialogOpts: Electron.SaveDialogOptions = {
      title: 'Сохранить карту как',
      buttonLabel: 'Сохранить',
      defaultPath: name,
      filters: [
        { name: 'Maps(*.map, *.off)', extensions: ['map', 'off'] },
        { name: 'All Files', extensions: ['*'] }
      ],
    };
    return from(this._electron.ipcRenderer.invoke('save-dialog', saveDialogOpts))
          .pipe(
            filter((res: SaveDialogReturnValue) => res.filePath && !res.canceled),
            switchMap((res) => from(this._electron.fs.promises.writeFile(res.filePath, this.mapGroupToXML(group).toString()))),
            catchError((err) => this._handleError(err)),
            take(1)
          );
  }
  
  public getMap(path: { path: string, name?: string}): Observable<any> {
    return this._api.getMap(path.path)
                    .pipe(
                      map((xml: string) => this.mapToObject(xml)),
                      catchError(throwError),
                    )
  }

  public posZChangeSuccess() {
    this._toast.show('success', `Успешное изменение posZ`, null, faInfo);
  }

  public mapToast(message: string, path: string, icon: IconDefinition, classname: string) {
    this._toast.show('default', message);
  }
  
  public mapNotLoaded(err: Error) {
    this._toast.show('danger', `Карта не был загружена по причине:`, err.message, faExclamationTriangle);
  }
}
