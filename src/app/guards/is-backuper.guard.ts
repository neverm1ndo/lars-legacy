import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { intersection } from 'lodash-es';

import { UserService } from '@lars/user/user.service';
import { Workgroup } from '@lars/enums/workgroup.enum';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { Backuper, Dev } = Workgroup;

const ALLOWED_GROUPS = [Backuper, Dev];
@Injectable({
  providedIn: 'root'
})
export class BackuperGuard implements CanActivate {
  constructor(private user: UserService) {}
  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const { permissions } = this.user.getCurrentUserInfo();

    if (intersection(permissions, ALLOWED_GROUPS)) return true;

    this.user.showAccessError();
    return false;
  }
}
