import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '@lars/user/user.service';
import { ToastService } from '@lars/toast.service';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Workgroup } from '@lars/enums/workgroup.enum';

const { Backuper, Dev } = Workgroup;

@Injectable({
  providedIn: 'root'
})
export class BackuperGuard implements CanActivate {
  constructor(private user: UserService, private toast: ToastService) {}
  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const { secondary_group } = this.user.getCurrentUserInfo();
    
    if ([Backuper, Dev].includes(secondary_group)) return true;
    
    this.user.showAccessError();
    return false;
  }
  
}
