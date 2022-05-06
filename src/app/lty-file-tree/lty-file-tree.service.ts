import { Injectable } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { TreeNode } from '../interfaces/app.interfaces';
import { sep } from 'path';

@Injectable({
  providedIn: 'any'
})
export class LtyFileTreeService {

  private _currentOpened: NgbDropdown | null;
  public activeItemPath: BehaviorSubject<string | null> = new BehaviorSubject(null);
  public expandedDirs: string[] = [];

  get currentOpenedContext() {
    return this._currentOpened;
  }

  set currentOpenedContext(contextDrop: NgbDropdown | null) {
    this._currentOpened = contextDrop;
  }

  constructor() {}

  expandFollowingDirs(nodes: TreeNode, path?: string): TreeNode {
    if (!path) return nodes;
    const separatedPath: string[] = path.split(sep);
    for (let item of nodes.items) {
      if (item.type != 'dir') continue;
      if (this.expandedDirs.includes(item.path)) item.expanded = true;
      if (!separatedPath.includes(item.name)) continue;
      item.expanded = true;
      this.expandFollowingDirs(item, path);
    }
    return nodes;
  };

  chooseDir(dir: string) {
    if (this.expandedDirs.includes(dir)) {
      this.expandedDirs.splice(this.expandedDirs.indexOf(dir), 1);
    } else {
      this.expandedDirs.push(dir);
    }
  }

  changeOpened(newTarget: NgbDropdown) {
    if (this._currentOpened == newTarget && !this._currentOpened.isOpen()) {
       this._currentOpened.open();
       return;
    }
    if (this._currentOpened) this._currentOpened.close();
    this._currentOpened = newTarget;
    newTarget.open();
  }

}
