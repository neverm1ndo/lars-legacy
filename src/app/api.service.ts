import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { LogLine } from './interfaces/app.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  URL: string = 'http://localhost:3080/api/uber'

  constructor(
    private http: HttpClient
  ) { }

  getLogFile(): Observable<any> {
    return this.http.get(this.URL);
  }
}
