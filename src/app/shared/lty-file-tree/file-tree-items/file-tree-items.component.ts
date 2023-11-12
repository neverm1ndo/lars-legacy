import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { faFolder, faFileAlt, faMap, faFileCode, faDatabase, faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { ITreeNode } from '@lars/interfaces/app.interfaces';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { LtyFileTreeService } from '../lty-file-tree.service';
import { extname } from 'path';

@Component({
  selector: 'file-tree-items',
  templateUrl: './file-tree-items.component.html',
  styleUrls: ['./file-tree-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileTreeItemsComponent implements OnInit {

  @Input('child-nodes') childNodes: ITreeNode;
  @Input('expanded') expanded: boolean;
  @Input('isRoot') private _isRoot: boolean;
  @Output() mvdir = new EventEmitter<string>();
  @Output() rmdir = new EventEmitter<string>();
  @Output() rm = new EventEmitter<string>();
  @Output('uploadFileList') uploadFileListEvent = new EventEmitter<{ filelist: FileList, path: string }>();
  @ViewChild('contextDrop', { static: true }) contextDrop: NgbDropdown;
  @ViewChild('contextDropItem', { static: true }) contextDropItem: NgbDropdown;

  private _opened: boolean = false;

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
    private _lfts: LtyFileTreeService,
  ) {}

  selectFile(file: { path: string, name: string }) {
    this._lfts.activeItemPath.next(file.path);
  }

  getFileIcon(item: ITreeNode) {
    if (item.type === 'dir') return faFolder;
    switch (extname(item.name)) {
      case '.map': return faMap;
      case '.db': return faDatabase;
      case '.cadb': return faDatabase;
      case '.conf': return faFileCode;
      default: return faFileAlt;
    }
  }

  isDir(type: string) {
    return type === 'dir';
  }

  isFile(type: string) {
    return type === 'file';
  }

  uploadDnD(event: any) {
    this.uploadFileListEvent.emit(event);
  }

  showContext(event: MouseEvent, drop: NgbDropdown, type: string) {
    if (this._isRoot && this.isDir(type)) return;
    event.stopPropagation();
    this._lfts.changeOpened(drop);
  }

  rmDir(path: string): void {
    this.rmdir.emit(path);
  }

  rmFile(path: string): void {
    this.rm.emit(path);
  }

  mvDir(path: string): void {
    this.mvdir.emit(path);
  }

  isOpen() {
    return this._opened;
  }

  getCurrent() {
    return this._lfts.activeItemPath;
  }

  toggleExpand(event: Event, path?: string):void {
    event.stopPropagation();
    event.preventDefault();
    this._opened = !this._opened;
    this._lfts.chooseDir(path);
    if (!this.contextDrop.isOpen()) return;
    this._lfts.currentOpenedContext = null;
    this.contextDrop.close();
  }

  ngOnInit(): void {
    if (this.expanded) this._opened = true;
  }
}
