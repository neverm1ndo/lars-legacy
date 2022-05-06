import { Injectable } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';
import { ElectronService } from './core/services';
import { Router } from '@angular/router';

import { BehaviorSubject, Subject, Observable, combineLatest } from 'rxjs';
import { tap, filter, takeLast } from 'rxjs/operators';

import { faTrash, faCopy, faInfo } from '@fortawesome/free-solid-svg-icons';

import { basename, dirname } from 'path';

@Injectable({
  providedIn: 'any'
})
export class ConfigsService {

  constructor(
    private _electron: ElectronService,
    private _api: ApiService,
    private _toast: ToastService,
    private _router: Router
  ) { }

  error: Subject<any> = new Subject();
  public reloader$: BehaviorSubject<any> = new BehaviorSubject(null);
  public dprogress: BehaviorSubject<number> = new BehaviorSubject(0);

  getConfig(path: string): Observable<any> {
    return combineLatest([
      this._api.getConfigText(path),
      this._api.getFileInfo(path)
    ])
  }

  saveFileAsBlob(path: string, blob: Blob): Observable<any> {
    const form: FormData = new FormData();
          form.append('path', dirname(path));
          form.append('file', blob, basename(path));
    return this._api.saveFile(form)
               .pipe(tap((event) => {
                 if (event.type === HttpEventType.UploadProgress) this.dprogress.next(Math.round(100 * event.loaded / event.total));
               }))
               .pipe(filter((event) => event instanceof HttpResponse))
               .pipe(takeLast(1))
  }

  downloadFile(path: string): void {
    let filename: string = ((): string => {
      const spl = path.split('/');
      return spl[spl.length - 1];
    })();
    const dialogOpts: Electron.SaveDialogOptions = {
      title: 'Сохранить карту как',
      buttonLabel: 'Сохранить',
      defaultPath: filename,
      filters: [
        { name: 'All Files', extensions: ['*'] }
      ]
    }

    this._electron.ipcRenderer.invoke('save-dialog', dialogOpts)
    .then(res => {
      if (res.filePath && !res.canceled) this._electron.ipcRenderer.send('download-file', { remotePath: path, localPath: res.filePath, token: JSON.parse(localStorage.getItem('user')).token });
    })
    .catch(res => {
      this._toast.show(`Файл <b>${ res.filePath }</b> не был загружен`,
        {
          classname: 'bg-warning text-dark',
          delay: 5000,
          icon: faInfo,
          subtext: res.message,
        });
    console.error(res);
    });
  }

  getFileInfo(path: string) {
    return this._api.getFileInfo(path);
  }

  toEmpty() {
    this._router.navigate(['/home/config-editor/empty']);
  }

  reloadFileTree() {
    this.reloader$.next(null);
  }

  async deleteFile(path: string): Promise<any> {
    const dialogOpts = {
      type: 'warning',
      buttons: ['Удалить', 'Отмена'],
      title: `Подтверждение удаления`,
      message: `Вы точно хотите удалить файл ${path}? После подтверждения он будет безвозвратно удален с сервера.`,
    };
    return this._electron.ipcRenderer.invoke('message-box', dialogOpts).then(
      val => {
        if (val.response !== 0) return;
        this._api.deleteMap(path).subscribe(() => {});
        this._toast.show(`Файл <b>${ path }</b> удален с сервера`,
          {
            classname: 'bg-success text-light',
            delay: 3000,
            icon: faTrash
          });
        this.toEmpty();
      }
    ).finally(() => {
      this.reloadFileTree();
    });
  }

  pathToClipboard(path: string): void {
    this._electron.ipcRenderer.invoke('clipboard', path).then(() => {
      this._toast.show('Путь скопирован в буффер обмена',
      {
        classname: 'bg-success text-light',
        delay: 3000,
        icon: faCopy
      });
    });
  }
}
