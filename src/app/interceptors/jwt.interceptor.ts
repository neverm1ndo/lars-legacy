import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

  constructor(public userService: UserService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.userService.isAuthenticated()) {      
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.userService.getUserInfo().token}`
        }
      });
    }
    return next.handle(request);
  }
}
