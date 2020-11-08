import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppConfig } from '../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly URL: string = AppConfig.api.main + 'uber';
  readonly URL_CONFIGS: string =  AppConfig.api.main + 'config-files-tree';
  readonly URL_CONFIG: string =  AppConfig.api.main + 'config-file';
  readonly URL_CONFIG_SAVE: string =  AppConfig.api.main + 'save-config-file';
  readonly URL_SEARCH: string =  AppConfig.api.main + 'search';

  reloader$: BehaviorSubject<any> = new BehaviorSubject(null);

  public loading: boolean = true;
  uber: Observable<any> = this.http.get(this.URL);

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
      switchMap(() => this.http.get(this.URL))
    )
  }
  search(query: {
    nickname?: Array<string>;
    date?: Array<string>;
    process?: Array<string>;
    as?: string;
    ss?: string;
  }): Observable<any> {
    this.loading = true;
    console.log(query);
    return this.http.get(this.URL_SEARCH, { params: query })
  }
  saveConfigFile(path:string, data: string): Observable<any> {
    return this.http.post(this.URL_CONFIG_SAVE, {
      file: {
        path: path,
        data: data
      }
    }, { responseType: 'text' })
  }

  refresh() {
    this.loading = true;
    this.reloader$.next(null);
  }
}
