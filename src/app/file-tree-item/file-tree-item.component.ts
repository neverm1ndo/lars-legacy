import { Component, OnInit, Input } from '@angular/core';
import { faFileAlt } from '@fortawesome/free-regular-svg-icons';
import { faFolder, faMap, faFileCode, faDatabase, faTrash } from '@fortawesome/free-solid-svg-icons';
import { TreeNode } from '../interfaces/app.interfaces';
import { ElectronService } from '../core/services/electron/electron.service';

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
    conf: faFileCode,
    db: faDatabase,
    trash: faTrash
  }

  isMapFile(name: string): boolean {
    return name.includes('.map');
  }
  isConfFile(name: string): boolean {
    return name.includes('.conf');
  }
  isShFile(name: string): boolean {
    return name.includes('.sh');
  }
  isDBFile(name: string): boolean {
    return name.includes('.db') || name.includes('.cadb');
  }

  constructor(private electron: ElectronService) { }

  ngOnInit(): void {
  }

}
