import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { faFolder, faFileAlt, faMap, faFileCode, faDatabase, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../api.service';
import { TreeNode } from '../interfaces/app.interfaces'

@Component({
  selector: 'file-tree-items',
  templateUrl: './file-tree-items.component.html',
  styleUrls: ['./file-tree-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileTreeItemsComponent implements OnInit {

  @Input('child-nodes') nodes: TreeNode;
  @Input('expanded') expanded: boolean;
  @Input('current') current: string;
  @Output() chooseFileEvent = new EventEmitter<{ path: string, name: string }>();
  @Output() chooseDirEvent = new EventEmitter<string>();
  @Output('uploadFileList') uploadFileListEvent = new EventEmitter<{ filelist: FileList, path: string }>();

  toggler: boolean = false;

  fa = {
    dir: faFolder,
    file: faFileAlt,
    map: faMap,
    conf: faFileCode,
    db: faDatabase,
    trash: faTrash
  };

  getConfig(path: { path: string, name: string }) {
    this.chooseFileEvent.emit(path);
  }

  getFileIcon(item: TreeNode) {
    if (item.type === 'dir') return faFolder;
    if (this.isMapFile(item.name)) return faMap;
    if (this.isDBFile(item.name)) return faDatabase;
    if (this.isConfFile(item.name)) return faFileCode;
    return faFileAlt;
  }

  uploadDnD(event: any) {
    this.uploadFileListEvent.emit(event);
  }

  showContext() {
    console.log('context');
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

  chooseDir(event: any): void {
    this.chooseDirEvent.emit(event);
  }

  toggleExpand(event: Event):void {
    event.stopPropagation();
    event.preventDefault();
    this.toggler = !this.toggler;
    this.chooseDir(this.nodes.path);
  }


  constructor(
    public api: ApiService,
  ) {}

  ngOnInit(): void {
    if (this.expanded) this.toggler = true;
  }

}
