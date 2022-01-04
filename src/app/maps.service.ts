import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';
import { ElectronService } from './core/services/electron/electron.service';
import { MapObject } from './interfaces/map.interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { filter, switchMap, take, catchError, map } from 'rxjs/operators';
import { faInfo, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor(
    private electron: ElectronService,
    private api: ApiService,
    private toast: ToastService
  ) { }

  private handleError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(error);
  }

  objectToMap(object: any[]): string {
    let res: string = '';
    for (let i = 0; i < object.length; i++) {
      Object.keys(object[i]).forEach((e: string, j: number) => {
        if (j === 0) {
          res += `<${object[i][e]} `
        }
        else { res += `${e}="${object[i][e]}" `};
        if (j === Object.keys(object[i]).length - 1) {
          res += `/>\n`;
        }
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
      }
    return this.electron.dialog.showMessageBox(dialogOpts)
    .then( val => {
      if (val.response === 0) return Promise.resolve()
      return Promise.reject();
    });
  }

  mapToObject(xml: string): MapObject[] {
    let parser = new DOMParser();
    const xmlfyRegex = new RegExp(' (edf:)(.*")');
    let map = parser.parseFromString(xml.replace(xmlfyRegex, ''), 'text/xml');
    let objects: MapObject[] = [];
    if (map.getElementsByTagName('parsererror')[0]) throw `NOT_XML: ${map.getElementsByTagName('parsererror')[0].children[1].textContent}`;
    if (!map.getElementsByTagName('map')[0]) throw 'MAP_TAG_IS_MISSING: map tag is not exists in this document';
    const elems = map.getElementsByTagName('map')[0].children;
    for (let i = 0; i < elems.length; i++) {
      const attrs = elems[i].attributes;
      let obj = { name: elems[i].tagName };
      for (let i = 0; i < attrs.length; i++) {
        const float = parseFloat(attrs[i].value);
        obj[attrs[i].name] = !isNaN(float) ? float : attrs[i].value;
      }
      if (obj.name !== 'parsererror') {
        objects.push(obj);
      }
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
    return from(this.electron.dialog.showMessageBox(dialogOpts))
    .pipe(filter(val => val.response === 0))
    .pipe(switchMap(() => this.api.deleteMap(path)))
    .pipe(take(1))
    .pipe(catchError((err) => this.handleError(err)))
    // .then(val => {
    //   if (val.response === 0) {
    //     this.api.deleteMap(path).pipe(take(1)).subscribe(() => {
    //       this.toast.show(`Карта <b>${ path }</b> удалена с сервера`,
    //         {
    //           classname: 'bg-success text-light',
    //           delay: 3000,
    //           icon: faTrash
    //         });
    //         this.reloadFileTree();
    //     });
    //   }
    // })
  }

  saveMapCloud(path: string, objects: MapObject[]): Observable<any> {
    const dialogOpts = {
        type: 'info',
        buttons: ['Сохранить', 'Отмена'],
        title: `Подтверждение сохранения на сервере`,
        message: `Вы точно хотите сохранить карту ${path}? После подтверждения она будет перезаписана на сервере.`
      }
      return from(this.electron.dialog.showMessageBox(dialogOpts))
      .pipe(filter(val => val.response === 0))
      .pipe(map(() => {
        const form = new FormData();
        const blob = new Blob([this.objectToMap(objects)], { type: 'text/plain' })
        form.append('file', blob, path);
        return form;
      }))
      .pipe(switchMap((form) => this.api.uploadFileMap(form)))
    // .then(
    //   val => {
    //     if (val.response === 0) {
    //       const form = new FormData();
    //       const blob = new Blob([this.objectToMap(objects)], { type: 'text/plain' })
    //
    //       /*sub =*/ this.api.uploadFileMap(form).subscribe(() => {}, () => {}, () => {
    //       this.toast.show(`Карта <b>${ name }</b> успешно перезаписана`,
    //         {
    //           classname: 'bg-success text-light',
    //           delay: 3000,
    //           icon: faSave,
    //           subtext: path
    //         });
    //     });
    //     }
    //   }
    // ).finally(() => {
    //   this.reloadFileTree();
    // });
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
    return from(this.electron.dialog.showSaveDialog(saveDialogOpts))
    .pipe(filter(res => res.filePath && !res.canceled))
    .pipe(switchMap((res) => from(new Promise((resolve, reject) => {
      this.electron.fs.writeFile(res.filePath, this.objectToMap(objects), 'utf8', (err: NodeJS.ErrnoException) => {
        err?reject(err):resolve();
      });
    }))))
    .pipe(catchError((err) => this.handleError(err)))


      // .then(res => {
      //   if (res.filePath && !res.canceled) {
      //     this.toast.show(`Карта <b>${ this.currentFileName }</b> успешно сохранена`,
      //       {
      //         classname: 'bg-success text-light',
      //         delay: 3000,
      //         icon: faSave,
      //         subtext: res.filePath
      //        });
      //   }
      // }).catch( res => {
      //   this.toast.show(`<b>${ res.filePath }</b> не была сохранена`,
      //     {
      //       classname: 'bg-warning text-dark',
      //       delay: 5000,
      //       icon: faInfo,
      //       subtext: res.message
      //      });
      // })
  }
  getMap(path: { path: string, name?: string}): Observable<any> {
    // if (!this.isChanged()) {
    // const dialogOpts: Electron.MessageBoxOptions = {
    //   type: 'warning',
    //   buttons: ['Да', 'Нет'],
    //   title: `Подтверждение отмены изменений`,
    //   message: `Есть несохраненные изменения в файле ${ path.path }. Сохранить изменения?`
    // }
    // const $ifChanged = from(this.electron.dialog.showMessageBox(dialogOpts))
    // .pipe(switchMap((val) => iif(() => val.response === 1, this.saveMapLocal(path)))
      // return (changed)
      // .pipe(filter((changed) => changed))
      // .pipe()
      // .pipe(filter((changed) => changed === false))
      // return iif(() => changed,
      // ,
    return this.api.getMap(path.path)
      // .pipe(switchMap(() => this.api.getMap(path.path)))
      // .pipe(catchError((err) => this.handleError(err)))
      .pipe(map((xml: string) => this.mapToObject(xml)))
      .pipe(catchError((err) => throwError(err)))

      // .subscribe(map => {
        // this.current = this.mapToObject(map);
        // this.xml = map;
        // this.currentFileName = path.name;
      // })
    // } else {

        // .then(
        //   val => {
        //     if (val.response === 0) {
        //       return this.saveMapLocal()
        //     } else {
        //       return Promise.resolve();
        //     }
        //   }
        // ).then(() => {
        //   this.reloadFileTree();
        //   this.api.getMap(path.path).subscribe(map => {
        //     this.current = this.mapToObject(map);
        //     this.xml = map;
        //     this.currentFileName = path.name;
        //   })
        // }).finally(() => {
        //   this.toViewMode();
        // });
    }
    posZChangeSuccess() {
      this.toast.show(`Успешное изменение posZ`,
      {
        classname: 'bg-success text-light',
        delay: 5000,
        icon: faInfo
      });
    }
    mapNotLoaded(err) {
      this.toast.show(`Карта не был загружена по причине:`, {
        classname: 'bg-danger text-light',
        delay: 6000,
        icon: faExclamationTriangle,
        subtext: err
      });
    }
}
