import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '@lars/user/user.service';
import { Workgroup } from '@lars/enums/workgroup.enum';
import { intersection } from 'lodash-es';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { Mapper, Backuper, Dev } = Workgroup;
const ALLOWED_GROUPS = [Mapper, Backuper, Dev];
@Injectable({
  providedIn: 'root'
})
export class MapperGuard implements CanActivate {
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
