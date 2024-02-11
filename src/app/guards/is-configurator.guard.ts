import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '@lars/user/domain/infrastructure/user.service';
import { Workgroup } from '@lars/enums/workgroup.enum';
import { intersection } from 'lodash';

const { CFR, Dev } = Workgroup;

const ALLOWED_GROUPS = [CFR, Dev];

@Injectable({
  providedIn: "root",
})
export class ConfiguratorGuard implements CanActivate {
  constructor(private user: UserService) {}
  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const { permissions } = this.user.loggedInUser$.getValue();

    if (intersection(permissions, ALLOWED_GROUPS)) return true;

    this.user.showAccessError();
    return false;
  }
}
