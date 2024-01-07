import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '@lars/user/user.service';
import { ToastService } from '@lars/toast.service';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Workgroup } from '@lars/enums/workgroup.enum';

const { Challenger, Dev, Admin } = Workgroup;

@Injectable({
  providedIn: 'root'
})
export class CommonGuard implements CanActivate {
  constructor(private user: UserService, private toast: ToastService) {}
  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const { main_group } = this.user.loggedInUser$.getValue();
    
    if ([Challenger, Admin, Dev].includes(main_group)) {
      return true;
    }
    
    this.user.showAccessError();
    return false;
  }
}
