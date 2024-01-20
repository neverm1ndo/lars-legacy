import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '@lars/user/domain/infrastructure/user.service';
import { ToastService } from '@lars/toast.service';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
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
