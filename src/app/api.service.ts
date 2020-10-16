import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  URL: string = 'https://localhost:9809/'

  constructor(
    private http: HttpClient
  ) { }

  getLogFile() {
    return this.http.get(this.URL);
  }
}
