import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { ToastService } from '../toast.service';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Workgroup } from '../enums/workgroup.enum';

const { Backuper, Dev } = Workgroup;

@Injectable({
  providedIn: 'root'
})
export class IsBackuperGuard implements CanActivate {
  constructor(private user: UserService, private toast: ToastService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let group = this.user.getUserInfo().secondary_group;
      if ((group == Backuper) || (group == Dev)) {
        return true;
      } else {
        this.toast.show('Доступ запрещен для вашей группы пользователей',
        {
          classname: 'bg-danger text-light',
          delay: 3000,
          icon: faExclamationTriangle,
          subtext: 'Ваша роль: ' + this.user.getUserGroupName(group)
        })
        return false;
      }
  }
  
}
