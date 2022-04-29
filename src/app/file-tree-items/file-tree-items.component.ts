import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild} from '@angular/core';
import { faFolder, faFileAlt, faMap, faFileCode, faDatabase, faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { TreeNode } from '../interfaces/app.interfaces';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { DdService } from '../core/services/dd.service';

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
  @Input('isRoot') isRoot: boolean;
  @Output() chooseFileEvent = new EventEmitter<{ path: string, name: string }>();
  @Output() chooseDirEvent = new EventEmitter<string>();
  @Output() mvDirEvent = new EventEmitter<string>();
  @Output() rmDirEvent = new EventEmitter<string>();
  @Output('uploadFileList') uploadFileListEvent = new EventEmitter<{ filelist: FileList, path: string }>();
  @ViewChild('contextDrop', { static: true }) contextDrop: NgbDropdown;

  toggler: boolean = false;

  fa = {
    dir: faFolder,
    file: faFileAlt,
    map: faMap,
    conf: faFileCode,
    db: faDatabase,
    trash: faTrash,
    pencil: faPencilAlt,
  };

  constructor(
    private dd: DdService
  ) {}

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

  showContext(event: MouseEvent) {
    if (this.isRoot) return;
    event.stopPropagation();
    this.dd.changeOpened(this.contextDrop);
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

  rmDir(path: string): void {
    this.rmDirEvent.emit(path);
  }

  mvDir(path: string): void {
    this.mvDirEvent.emit(path);
  }

  toggleExpand(event: Event):void {
    event.stopPropagation();
    event.preventDefault();
    if (this.contextDrop.isOpen()) {
      this.dd.currentOpened = null;
      this.contextDrop.close();
    }
    this.toggler = !this.toggler;
    this.chooseDir(this.nodes.path);
  }

  ngOnInit(): void {
    if (this.expanded) this.toggler = true;
  }

}
