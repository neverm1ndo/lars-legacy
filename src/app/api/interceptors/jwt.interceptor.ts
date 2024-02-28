import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../../user/user.service';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

  constructor(private user: UserService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.user.isAuthenticated()) {
      const { token } = this.user.loggedInUser$.value;
      request = request.clone({
        setHeaders: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request);
  }
}
