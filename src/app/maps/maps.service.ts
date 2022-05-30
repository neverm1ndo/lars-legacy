import { Injectable } from '@angular/core';
import { ApiService } from './../api.service';
import { ToastService } from './../toast.service';
import { ElectronService } from './../core/services';
import { MapObject } from './../interfaces/map.interfaces';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { filter, switchMap, take, catchError, map } from 'rxjs/operators';
import { faInfo, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

@Injectable({
  providedIn: 'any'
})
export class MapsService {

  constructor(
    private _electron: ElectronService,
    private _api: ApiService,
    private _toast: ToastService
  ) { }

  private handleError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    return throwError(error);
  }

  objectToMap(object: any[]): string {
    let res: string = '';
    for (let i = 0; i < object.length; i++) {
      Object.keys(object[i]).forEach((e: string, j: number) => {
        if (j === 0) res += `<${object[i][e]} `
        else res += `${e}="${object[i][e]}" `;
        if (j === Object.keys(object[i]).length - 1) res += `/>\n`;
      });
    }
    return `<map edf:definitions="editor_main">\n` + res + `<!--\n LARS gta-liberty.ru \n-->\n` + '</map>';
  }

  async cancelChanges(path: string): Promise<any> {
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

  mapToObject(xml: string): MapObject[] {
    let parser = new DOMParser();
    const xmlfyRegex = new RegExp(' (edf:)(.*")');
    let map = parser.parseFromString(xml.replace(xmlfyRegex, ''), 'text/xml');
    let objects: MapObject[] = [];
    if (map.getElementsByTagName('parsererror')[0]) {
      let errormsg: string = map.getElementsByTagName('parsererror')[0].children[1].textContent;
      console.warn(`NOT_XML: ${errormsg}`);
    }
    if (!map.getElementsByTagName('map')[0]) throw new Error('MAP_TAG_IS_MISSING: map tag is not exists in this document');
    const elems = map.getElementsByTagName('map')[0].children;
    for (let i = 0; i < elems.length; i++) {
      const attrs = elems[i].attributes;
      let obj = { name: elems[i].tagName };
      for (let i = 0; i < attrs.length; i++) {
        const float = parseFloat(attrs[i].value);
        obj[attrs[i].name] = !isNaN(float) ? float : attrs[i].value;
      }
      if (obj.name !== 'parsererror') objects.push(obj);
    }
    return objects;
  }

  deleteMapCloud(path: string): Observable<any> {
    const dialogOpts = {
        type: 'warning',
        buttons: ['Удалить', 'Отмена'],
        title: `Подтверждение удаления`,
        message: `Вы точно хотите удалить карту ${path}? После подтверждения она будет безвозвратно удалена с сервера.`
      }
    return from(this._electron.ipcRenderer.invoke('message-box', dialogOpts))
    .pipe(filter(val => val.response === 0))
    .pipe(switchMap(() => this._api.deleteMap(path)))
    .pipe(take(1))
    .pipe(catchError((err) => this.handleError(err)))
  }

  saveMapCloud(path: string, objects: MapObject[]): Observable<any> {
    const dialogOpts = {
        type: 'info',
        buttons: ['Сохранить', 'Отмена'],
        title: `Подтверждение сохранения на сервере`,
        message: `Вы точно хотите сохранить карту ${path}? После подтверждения она будет перезаписана на сервере.`
      }
      return from(this._electron.ipcRenderer.invoke('message-box', dialogOpts))
      .pipe(filter(val => val.response === 0))
      .pipe(map(() => {
        const form = new FormData();
        const blob = new Blob([this.objectToMap(objects)], { type: 'text/plain' })
        form.append('file', blob, path);
        return form;
      }))
      .pipe(switchMap((form) => this._api.uploadFileMap(form)))
      .pipe(filter((event) => event instanceof HttpResponse))
      .pipe(take(1))
  }
  saveMapLocal(name: string, objects: MapObject[]) {
    const saveDialogOpts: Electron.SaveDialogOptions = {
      title: 'Сохранить карту как',
      buttonLabel: 'Сохранить',
      defaultPath: name,
      filters: [
        { name: 'Maps(*.map, *.off)', extensions: ['map', 'off'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    }
    return from(this._electron.ipcRenderer.invoke('save-dialog', saveDialogOpts))
    .pipe(filter(res => res.filePath && !res.canceled))
    .pipe(switchMap((res) => from(new Promise((resolve, reject) => {
      this._electron.fs.writeFile(res.filePath, this.objectToMap(objects), 'utf8', (err: NodeJS.ErrnoException) => {
        err?reject(err):resolve(res.filePath);
      });
    }))))
    .pipe(catchError((err) => this.handleError(err)))
    .pipe(take(1))
  }
  getMap(path: { path: string, name?: string}): Observable<any> {
    return this._api.getMap(path.path)
      .pipe(map((xml: string) => this.mapToObject(xml)))
      .pipe(catchError((err) => throwError(err)))
  }

  posZChangeSuccess() {
    this._toast.show(`Успешное изменение posZ`,
    {
      classname: 'bg-success text-light',
      delay: 5000,
      icon: faInfo
    });
  }

  mapToast(message: string, path: string, icon: IconDefinition, classname: string) {
    this._toast.show(message, {
      classname,
      delay: 6000,
      icon,
      subtext: path
    });
  }
  mapNotLoaded(err: Error) {
    this._toast.show(`Карта не был загружена по причине:`, {
      classname: 'bg-danger text-light',
      delay: 6000,
      icon: faExclamationTriangle,
      subtext: err.message
    });
  }
}
