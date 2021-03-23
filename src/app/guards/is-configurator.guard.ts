import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { ToastService } from '../toast.service';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class IsConfiguratorGuard implements CanActivate {
  constructor(private user: UserService, private toast: ToastService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let group = this.user.getUserInfo().gr;
      if ((group == 13) || (group == 10)) {
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
