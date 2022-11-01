import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '@lars/user.service';
import { ToastService } from '@lars/toast.service';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Workgroup } from '@lars/enums/workgroup.enum';

const { Mapper, Backuper, Dev } = Workgroup;

@Injectable({
  providedIn: 'root'
})
export class MapperGuard implements CanActivate {
  constructor(private user: UserService, private toast: ToastService) {}
  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const { secondary_group } = this.user.loggedInUser$.getValue();
      
      if ([Mapper, Backuper, Dev].includes(secondary_group)) return true;
      
      this.user.showAccessError();
      return false;
  }
}
