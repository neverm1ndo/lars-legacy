import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';
import { ElectronService } from './core/services';
import { Router } from '@angular/router';

import { BehaviorSubject, Subject, Observable, combineLatest } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleError } from './utils';

import { faTrash, faCopy, faInfo } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'any'
})
export class ConfigsService {

  constructor(
    private electron: ElectronService,
    private api: ApiService,
    private toast: ToastService,
    private router: Router
  ) { }

  error: Subject<any> = new Subject();
  public reloader$: BehaviorSubject<any> = new BehaviorSubject(null);
  public dprogress: BehaviorSubject<number> = new BehaviorSubject(0);

  getConfig(path: string): Observable<any> {
    return combineLatest([
      this.api.getConfigText(path),
      this.api.getFileInfo(path)
    ])
  }
  saveFile(path: string, text: string): Observable<any>  {
    this.error.next(null);
    return this.api.saveFile(path, text)
    .pipe(catchError((error) => handleError(error)));
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

    this.electron.ipcRenderer.invoke('save-dialog', dialogOpts)
    .then(res => {
      if (res.filePath && !res.canceled) this.electron.ipcRenderer.send('download-file', { remotePath: path, localPath: res.filePath, token: JSON.parse(localStorage.getItem('user')).token });
    })
    .catch(res => {
      this.toast.show(`Файл <b>${ res.filePath }</b> не был загружен`,
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
    return this.api.getFileInfo(path);
  }

  toEmpty() {
    this.router.navigate(['/home/config-editor/empty']);
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
    return this.electron.ipcRenderer.invoke('message-box', dialogOpts).then(
      val => {
        if (val.response !== 0) return;
        this.api.deleteMap(path).subscribe(() => {});
        this.toast.show(`Файл <b>${ path }</b> удален с сервера`,
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
    this.electron.ipcRenderer.invoke('clipboard', path).then(() => {
      this.toast.show('Путь скопирован в буффер обмена',
      {
        classname: 'bg-success text-light',
        delay: 3000,
        icon: faCopy
      });
    });
  }
}
