import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '@lars/user/domain/infrastructure/user.service';
import { ToastService } from '@lars/toast.service';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Workgroup } from '@lars/enums/workgroup.enum';

const { Dev } = Workgroup;

@Injectable({
  providedIn: 'root'
})
export class DevGuard implements CanActivate {
  constructor(private user: UserService) {}
  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { main_group } = this.user.loggedInUser$.getValue();

    if (main_group === Dev) return true;

    this.user.showAccessError();
    return false;
  }
}
