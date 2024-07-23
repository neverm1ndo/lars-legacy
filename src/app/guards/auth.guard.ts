import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '@lars/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(
    private user: UserService,
    private router: Router
  ) {}
  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.user.isAuthenticated()) return true;
    this.router.navigate(['/login'], {
      queryParams: {
        return: state.url
      }
    });
    return false;
  }
}
