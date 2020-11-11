import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppConfig } from '../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly URL: string = AppConfig.api.main + 'last';
  readonly URL_CONFIGS: string =  AppConfig.api.main + 'config-files-tree';
  readonly URL_CONFIG: string =  AppConfig.api.main + 'config-file';
  readonly URL_CONFIG_SAVE: string =  AppConfig.api.main + 'save-config-file';
  readonly URL_SEARCH: string =  AppConfig.api.main + 'search';

  reloader$: BehaviorSubject<any> = new BehaviorSubject(null);

  public loading: boolean = true;

  lastQuery: Observable<any> = this.http.get(this.URL, { params: { page: '0', lim: '50'}});

  currentPage: number = 0;


  constructor(
    private http: HttpClient
  ) { }

  getConfigsDir(): Observable<any> {
    return this.http.get(this.URL_CONFIGS);
  }
  getConfigText(path: string): Observable<any> {
     const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
     return this.http.get(this.URL_CONFIG, { params: { path: path }, headers, responseType: 'text'});
  }
  getLogFile(): Observable<any> {
    this.loading = true;
    return this.reloader$.pipe(
      switchMap(() => this.lastQuery)
    )
  }
  lazyUpdate(): void {
    this.lastQuery = this.http.get(this.URL, { params: { page: this.currentPage.toString(), lim: '50'}})
    this.refresh();
  }
  search(query: {
    nickname?: Array<string>;
    date?: Array<string>;
    process?: Array<string>;
    as?: string;
    ss?: string;
    page?: string;
    lim?: string
  }): Observable<any> {
    this.loading = true;
    this.lastQuery = this.http.get(this.URL_SEARCH, { params: query });
    return this.lastQuery;
  }
  saveConfigFile(path:string, data: string): Observable<any> {
    return this.http.post(this.URL_CONFIG_SAVE, {
      file: {
        path: path,
        data: data
      }
    }, { responseType: 'text' })
  }
  addToRecent(key: string, val: string): void {
    let last = JSON.parse(localStorage.getItem('last'));
    if (last[key].length >= 10) {
      last[key].splice(-(last[key].length), 0, val);
      last[key].pop();
    } else {
      last[key].push(val);
    }
    localStorage.setItem('last', JSON.stringify(last));
  }

  clearLast(): void {
    this.lastQuery = this.http.get(this.URL, { params: { page: '0', lim: '50'}});
  }

  refresh() {
    this.loading = true;
    this.reloader$.next(null);
  }
}
