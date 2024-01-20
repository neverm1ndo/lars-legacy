import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { UserService } from "../../user/domain/infrastructure/user.service";

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  constructor(private _user: UserService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (this._user.isAuthenticated()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this._user.loggedInUser$.getValue().token}`,
        },
      });
    }
    return next.handle(request);
  }
}
