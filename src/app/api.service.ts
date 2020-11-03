import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly URL: string = 'http://localhost:3080/api/uber';
  readonly URL_CONFIGS: string = 'http://localhost:3080/api/config-files-tree';
  readonly URL_CONFIG: string = 'http://localhost:3080/api/config-file';
  readonly URL_CONFIG_SAVE: string = 'http://localhost:3080/api/save-config-file';
  readonly URL_SEARCH: string = 'http://localhost:3080/api/search';

  reloader$: BehaviorSubject<any> = new BehaviorSubject(null);

  public loading: boolean = true;
  uber: Observable<any> = this.http.get(this.URL);
  currentFile: string = '';

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
    nickname?: string;
    date?: string;
    process?: string;
    as?: string;
    ss?: string;
  }): Observable<any> {
    this.loading = true;
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
