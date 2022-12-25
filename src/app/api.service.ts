import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AppConfig } from '../environments/environment';
import { UserService } from './user.service';
import { handleError } from './utils';
import { LogLine } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
 
  protected URL = (() => {
    const main: string = AppConfig.api.main;
    const routes = {
      LOGS: {
        __route: 'logs',
        LAST: 'last',
        SEARCH: 'search',
      },
      CONFIGS: {
        __route: 'configs',
        FILE_TREE: 'config-files-tree',
        CONFIG_FILE: 'config-file',
        FILE_STATS: 'file-info',
        UPLOAD: 'upload-file',
        SAVE_FILE: 'save-config',
      },
      MAPS: {
        __route: 'maps',
        FILE_TREE: 'maps-file-tree',
        MAP_FILE: 'map-file',
        UPLOAD: 'upload-map'
      },
      ADMINS: {
        __route: 'admins',
        LIST: 'list',
        CHANGE_MAIN_GROUP: 'change-group',
        CHANGE_SECONDARY_GROUP: 'change-secondary-group',
      },
      BACKUPS: {
        __route: 'backups',
        LIST: 'backups-list',
        RESTORE: 'restore-backup',
        REMOVE: 'remove-backup',
        BACKUP_FILE: 'backup-file',
        SIZE: 'size',
      },
      STATS: {
        __route: 'stats',
        ONLINE: 'online',
        CHAT: 'chat',
      },
      UTILS: {
        __route: 'utils',
        DELETE_FILE: 'delete-file',
        MKDIR: 'mkdir',
        RMDIR: 'rmdir',
        MVDIR: 'mvdir',
      }
    };

    function buildTree(routes: any): typeof routes {
      const routeName: string = routes.__route + '/';
      for (let route in routes) {
        if (typeof routes[route] === 'string') {
          if (route.startsWith('_')) continue;
          routes[route] = main + routeName + routes[route]; 
        } else {
          routes[route] = buildTree(routes[route]);
        }
      }
      return routes;
    }

    return buildTree(routes);
  })();

  constructor(
    private _http: HttpClient,
    private _user: UserService
  ) {}

  getChunkSize(): string {
    return this._user.getUserSettings().lineChunk.toString();
  }

  getAdminsList(): Observable<any> {
    return this._http.get(this.URL.ADMINS.LIST);
  }
  setAdminGroup(id: number, group: number) {
    return this._http.put(this.URL.ADMINS.CHANGE_MAIN_GROUP, { id, group: group })
  }
  setAdminSecondaryGroup(id: number, group: number) {
    return this._http.put(this.URL.ADMINS.CHANGE_SECONDARY_GROUP, { id, group: group })
  }
  getConfigsDir(): Observable<any> {
    return this._http.get(this.URL.CONFIGS.FILE_TREE);
  }
  getMapsDir(): Observable<any> {
    return this._http.get(this.URL.MAPS.FILE_TREE);
  }
  getConfigText(path: string): Observable<any> {
     return this._http.get(this.URL.CONFIGS.CONFIG_FILE, { params: { path: path }, responseType: 'text'});
  }
  getMap(path: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'text/xml' }).set('Accept', 'text/xml');
    return this._http.get(this.URL.MAP.MAP_FILE, { params: { path: path }, headers: headers, responseType: 'text' });
  }
  deleteMap(path: string) {
    return this._http.delete(this.URL.UTILS.DELETE_FILE, { params: { path: path }});
  }
  getLast(filter?: string[]): Observable<any> {
    if (!filter) filter = [];
    return this._http.get(this.URL.LOGS.LAST, { params: { page: 0, lim: this.getChunkSize(), filter: filter.join(',')}});
  }
  getLogFile(query: string, page: number, limit: number, filter: string[], date?: { from: string, to: string }): Observable<LogLine[]> {
    return this.search(query, page, limit, filter, date);
  }
  getFileInfo(path: string): Observable<any> {
    return this._http.get(this.URL.CONFIGS.FILE_STATS, { params: { path: path }});
  }

  saveFile(form: FormData): Observable<any> {
    return this._http.post(this.URL.CONFIGS.SAVE_CONFIG, form, { reportProgress: true, observe: 'events', responseType: 'blob' });
  }

  uploadFileMap(form: FormData): Observable<any> {
    return this._http.post(this.URL.MAPS.UPLOAD, form, { reportProgress: true, observe: 'events', responseType: 'blob' });
  }
  uploadFileCfg(form: FormData): Observable<any> {
    return this._http.post(this.URL.CONFIGS.UPLOAD, form, { reportProgress: true, observe: 'events', responseType: 'blob' });
  }

  getBackupsList(): Observable<any> {
    return this._http.get(this.URL.BACKUPS.LIST)
  }
  getBackupFile(hash: string): Observable<any> {
    return this._http.get(`${this.URL.BACKUPS.FILE}/${hash}`, { responseType: 'text' })
  }
  restoreBackup(hash: string): Observable<any> {
    return this._http.get(`${this.URL.BACKUPS.RESTORE}/${hash}`);
  }
  removeBackup(hash: string): Observable<any> {
    return this._http.delete(`${this.URL.BACKUPS.REMOVE}/${hash}`);
  }
  
  getBackupsSize(): Observable<any> {
    return this._http.get(this.URL.BACKUPS.SIZE);
  }

  getStatsOnline(date: Date): Observable<any> {
    return this._http.get(this.URL.STATS.ONLINE, { params: { day: date.toISOString()}});
  }
  getStatsChat(): Observable<any> {
    return this._http.get(this.URL.STATS.CHAT);
  }

  createDirectory(path: string): Observable<any> {
    return this._http.post(this.URL.UTILS.MKDIR, { path })
               .pipe(catchError((error) => handleError(error)));
  }
  removeDirectory(path: string): Observable<any> {
    return this._http.delete(this.URL.UTILS.RMDIR, { params: { path }})
               .pipe(catchError((error) => handleError(error)));
  }
  moveDirectory(path: string, dest: string): Observable<any> {
    return this._http.patch(this.URL.UTILS.MVDIR, { path, dest })
               .pipe(catchError((error) => handleError(error)));
  }

  search(query: any, page: number, limit: number, filter?: string[], date?: { from?: string, to?: string}): Observable<LogLine[]> {
    let params: HttpParams = new HttpParams().appendAll({
      search: query,
      page: page.toString(),
      lim: limit.toString(),
      filter: filter ? filter.join(',') : '',
    });
    if (date) {
      if (date.from) params = params.append('dateFrom', new Date(date.from).valueOf());
      if (date.to) params = params.append('dateTo', new Date(date.to).valueOf());
    }
    return this._http.get<LogLine[]>(this.URL.LOGS.SEARCH, { params });
  }

  addToRecent(key: string, val: any): void { // FIXME: REPLACE TO THE SEPARATE HISTORY SERVICE
    let last: string = JSON.parse(window.localStorage.getItem('last'));
    if (this.noteIsAlreadyExists(last, key, val)) return;
    if (last[key].length >= 30) {
      last[key].splice(-(last[key].length), 0, val);
      last[key].pop();
    } else {
      last[key].push(val);
    }
    window.localStorage.setItem('last', JSON.stringify(last));
  }

  noteIsAlreadyExists(last: any, key: string, val: any): boolean {
    for (let i = 0; i < last[key].length; i++) {
      if (typeof last[key][i] == 'string') {
        if (last[key][i] === val) {
          return true;
        }
      } else {
        if (last[key][i].path === val.path && last[key][i].name === val.name) {
          return true;
        }
      }
    }
    return false;
  }
}
