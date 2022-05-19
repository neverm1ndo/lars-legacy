import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export const handleError = (error: HttpErrorResponse): Observable<HttpErrorResponse> => {
  if (error.error instanceof ErrorEvent) {
    console.error('An error occurred:', error.error.message);
  } else {
    console.error( `Backend returned code ${error.status} \n body was: ${error.error}`);
  }
  return throwError(error);
};
