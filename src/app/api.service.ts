import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AppConfig } from '../environments/environment';
import { UserService } from './user.service';
import { handleError } from './utils';
import { LogLine } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly URL_LAST: string = AppConfig.api.main + 'logs/last';
  readonly URL_SEARCH: string =  AppConfig.api.main + 'logs/search';
  readonly URL_CONFIGS: string =  AppConfig.api.main + 'configs/config-files-tree';
  readonly URL_CONFIG: string =  AppConfig.api.main + 'configs/config-file';
  readonly URL_FILE_INFO: string =  AppConfig.api.main + 'configs/file-info';
  readonly URL_UPLOAD_CFG: string =  AppConfig.api.main + 'configs/upload-file';
  readonly URL_SAVE_CONFIG: string =  AppConfig.api.main + 'configs/save-config';
  readonly URL_UPLOAD_MAP: string =  AppConfig.api.main + 'maps/upload-map';
  readonly URL_MAPS: string =  AppConfig.api.main + 'maps/maps-files-tree';
  readonly URL_MAPINFO: string = AppConfig.api.main + 'maps/map-file';
  readonly URL_DELETE_FILE: string = AppConfig.api.main + 'utils/delete-file';
  readonly URL_ADMINS_LIST: string = AppConfig.api.main + 'admins/list';
  readonly URL_ADMIN_CHANGE_GROUP: string = AppConfig.api.main + 'admins/change-group';
  readonly URL_ADMIN_CHANGE_SECONDARY_GROUP: string = AppConfig.api.main + 'admins/change-secondary-group';
  readonly URL_ADMIN_TOKEN_EXPIRATION: string = AppConfig.api.main + 'admins/expire-token';
  readonly URL_BACKUPS_LIST: string = AppConfig.api.main + 'backups/backups-list';
  readonly URL_BACKUPS_RESTORE: string = AppConfig.api.main + 'backups/restore-backup';
  readonly URL_BACKUP_FILE: string = AppConfig.api.main + 'backups/backup-file';
  readonly URL_BACKUPS_SIZE: string = AppConfig.api.main + 'backups/size';
  readonly URL_STATS_ONLINE: string = AppConfig.api.main + 'stats/online';
  readonly URL_STATS_CHAT: string = AppConfig.api.main + 'stats/chat';
  readonly URL_MKDIR: string = AppConfig.api.main + 'utils/mkdir';
  readonly URL_RMDIR: string = AppConfig.api.main + 'utils/rmdir';
  readonly URL_MVDIR: string = AppConfig.api.main + 'utils/mvdir';

  readonly SERVER_MONITOR: string = AppConfig.links.server_monitor;

  constructor(
    private http: HttpClient,
    private user: UserService
  ) {}

  getChunkSize(): string {
    return this.user.getUserSettings().lineChunk.toString();
  }

  getAdminsList(): Observable<any> {
    return this.http.get(this.URL_ADMINS_LIST);
  }
  setAdminGroup(id: number, group: number) {
    return this.http.put(this.URL_ADMIN_CHANGE_GROUP, { id, group: group })
  }
  setAdminSecondaryGroup(id: number, group: number) {
    return this.http.put(this.URL_ADMIN_CHANGE_SECONDARY_GROUP, { id, group: group })
  }
  closeAdminSession(username: string): Observable<any> {
    return this.http.get(this.URL_ADMIN_TOKEN_EXPIRATION, { params: { username: username }})
  }
  getConfigsDir(): Observable<any> {
    return this.http.get(this.URL_CONFIGS);
  }
  getMapsDir(): Observable<any> {
    return this.http.get(this.URL_MAPS);
  }
  getConfigText(path: string): Observable<any> {
     return this.http.get(this.URL_CONFIG, { params: { path: path }, responseType: 'text'});
  }
  getMap(path: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'text/xml' }).set('Accept', 'text/xml');
    return this.http.get(this.URL_MAPINFO, { params: { path: path }, headers: headers, responseType: 'text' });
  }
  deleteMap(path: string) {
    return this.http.delete(this.URL_DELETE_FILE, { params: { path: path }});
  }
  getLast(filter?: string[]): Observable<any> {
    if (!filter) filter = [];
    return this.http.get(this.URL_LAST, { params: { page: 0, lim: this.getChunkSize(), filter: filter.join(',')}});
  }
  getLogFile(query: string, page: number, limit: number, filter: string[], date?: { from: string, to: string }): Observable<LogLine[]> {
    return this.search(query, page, limit, filter, date);
  }
  getFileInfo(path: string): Observable<any> {
    return this.http.get(this.URL_FILE_INFO, { params: { path: path }});
  }

  saveFile(form: FormData): Observable<any> {
    return this.http.post(this.URL_SAVE_CONFIG, form, { reportProgress: true, observe: 'events', responseType: 'blob' });
  }

  uploadFileMap(form: FormData): Observable<any> {
    return this.http.post(this.URL_UPLOAD_MAP, form, { reportProgress: true, observe: 'events', responseType: 'blob' });
  }
  uploadFileCfg(form: FormData): Observable<any> {
    return this.http.post(this.URL_UPLOAD_CFG, form, { reportProgress: true, observe: 'events', responseType: 'blob' });
  }

  getBackupsList(): Observable<any> {
    return this.http.get(this.URL_BACKUPS_LIST)
  }
  getBackupFile(name: string, unix: number): Observable<any> {
    return this.http.get(this.URL_BACKUP_FILE, { params: { name, unix: String(unix) }, responseType: 'text'})
  }
  restoreBackup(path: string, unix: string): Observable<any> {
    return this.http.get(this.URL_BACKUPS_RESTORE, { params: { path, unix } });
  }
  getBackupsSize(): Observable<any> {
    return this.http.get(this.URL_BACKUPS_SIZE);
  }
  getStatsOnline(date: Date): Observable<any> {
    return this.http.get(this.URL_STATS_ONLINE, { params: { day: date.toISOString()}});
  }
  getStatsChat(): Observable<any> {
    return this.http.get(this.URL_STATS_CHAT);
  }

  createDirectory(path: string): Observable<any> {
    return this.http.post(this.URL_MKDIR, { path })
               .pipe(catchError((error) => handleError(error)));
  }
  removeDirectory(path: string): Observable<any> {
    return this.http.delete(this.URL_RMDIR, { params: { path }})
               .pipe(catchError((error) => handleError(error)));
  }
  moveDirectory(path: string, dest: string): Observable<any> {
    return this.http.patch(this.URL_MVDIR, { path, dest })
               .pipe(catchError((error) => handleError(error)));
  }

  getSampServerMonitor(): Observable<any> {
    return this.http.get(this.SERVER_MONITOR, { params: { ip: new URL(AppConfig.api.main).host, port: 7777 }});
  }

  // lazyUpdate(page: number): void {
  //   if (this.currentPage >= 0 && (this.currentPage + page) !== -1) {
  //     this.lazy = true;
  //     this.currentPage += page;
  //     this.refresh();
  //   }
  // }

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
    return this.http.get<LogLine[]>(this.URL_SEARCH, { params });
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
