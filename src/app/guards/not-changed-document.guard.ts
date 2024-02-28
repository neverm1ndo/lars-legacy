import { Injectable, Inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { ConfigsService } from '@lars/configs/configs.service';
import { Observable } from 'rxjs';

@Injectable()
export class NotChangedDocumentGuard implements CanDeactivate<unknown> {
  constructor(@Inject(ConfigsService) private __configs: ConfigsService) {}

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return !this.__configs.changed$.getValue();
  }
}
