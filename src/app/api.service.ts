import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  URL: string = 'http://localhost:3080/api/uber';
  URL_CONFIGS: string = 'http://localhost:3080/api/config-files-tree';
  URL_CONFIG: string = 'http://localhost:3080/api/config-file';
  URL_CONFIG_SAVE: string = 'http://localhost:3080/api/save-config-file';

  reloader$: BehaviorSubject<any> = new BehaviorSubject(null);

  public loading: boolean = false;
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
