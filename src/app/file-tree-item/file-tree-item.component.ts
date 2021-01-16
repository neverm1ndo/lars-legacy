import { Component, OnInit, Input } from '@angular/core';
import { faFileAlt } from '@fortawesome/free-regular-svg-icons';
import { faFolder, faMap, faFileCode } from '@fortawesome/free-solid-svg-icons';
import { TreeNode } from '../interfaces/app.interfaces';

@Component({
  selector: 'file-tree-item',
  templateUrl: './file-tree-item.component.html',
  styleUrls: ['./file-tree-item.component.scss']
})
export class FileTreeItemComponent implements OnInit {

  @Input('item') item: TreeNode;
  @Input('current') current: string;

  fa = {
    file: faFileAlt,
    dir: faFolder,
    map: faMap,
    conf: faFileCode
  }

  isMapFile(name: string): boolean {
    return name.includes('.map');
  }
  isConfFile(name: string): boolean {
    return name.includes('.conf');
  }

  constructor() { }

  ngOnInit(): void {
  }

}
