import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { LogLine } from './interfaces/app.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  URL: string = 'http://localhost:3080/api/uber';

  reloader$: BehaviorSubject<any> = new BehaviorSubject(null);

  public loading: boolean = false;

  constructor(
    private http: HttpClient
  ) { }
  uber: Observable<any> = this.http.get(this.URL);

  getLogFile(): Observable<any> {
    this.loading = true;
    return this.reloader$.pipe(
      switchMap(() => this.http.get(this.URL))
    )
  }

  refresh() {
    this.loading = true;
    this.reloader$.next(null);
  }
}
