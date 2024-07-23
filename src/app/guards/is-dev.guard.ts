import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '@lars/user/user.service';
import { Workgroup } from '@lars/enums/workgroup.enum';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { Dev } = Workgroup;

@Injectable({
  providedIn: 'root'
})
export class DevGuard  {
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
