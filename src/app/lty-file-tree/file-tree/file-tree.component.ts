import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LtyFileTreeService } from '../lty-file-tree.service';
import { Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { TreeNode } from '../../interfaces/app.interfaces';
import { faSyncAlt, faFile, faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { settings } from '../../app.animations';
import { basename, posix } from 'path';

interface FilePathName {
  path: string,
  name?: string,
}

@Component({
  selector: 'file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
  animations: [settings],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileTreeComponent implements OnInit, OnDestroy {


  node: TreeNode;

  modals = {
    mkDir: false,
    mvDir: false,
    closeAll: function(){
      this.mkDir = false;
      this.mvDir = false;
    }
  }
  @Input('current') current: string;
  @Input('items') set nodes(nodes: TreeNode) {
    if (!nodes) return;
    this.node = this._lfts.expandFollowingDirs(nodes, this.current);
  };
  @Output() fileSelect = new EventEmitter<FilePathName>();
  @Output() dirSelect = new EventEmitter<string>();
  @Output() rmdir = new EventEmitter<string>();
  @Output() mvdir = new EventEmitter<{ path: string; dest: string}>();
  @Output() mkdir = new EventEmitter<string>();
  @Output() addNew = new EventEmitter<Event>();
  @Output() resync = new EventEmitter<any>();

  @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.key == 'Escape') this.modals.closeAll();
  }

  fileTreeEvents: Subscription = new Subscription();

  addNewDir: FormGroup = new FormGroup({
    path: new FormControl('/', [
      Validators.required,
    ]),
  });

  mvDirGroup: FormGroup = new FormGroup({
    path: new FormControl('/', [
      Validators.required,
    ]),
    dest: new FormControl('/', [
      Validators.required,
    ]),
  });

  fa = {
    sync: faSyncAlt,
    file: faFile,
    folderPlus: faFolderPlus
  };

  constructor(private _lfts: LtyFileTreeService) { }


  mvDirEventHandle(path: string) {
    this.mvDirGroup.setValue({ path, dest: path });
    this.modals.mvDir = true;
  }

  rmDir(path: string) {
    this.rmdir.emit(posix.normalize(path));
  }

  mvDir() {
    const { path, dest } = this.mvDirGroup.value;
    this.mvdir.emit({ path: posix.normalize(path), dest: posix.normalize(dest) });
    this.modals.mvDir = false;
  }

  sync(): void {
    this.resync.emit();
  }

  upload(event: any): void {
    this.addNew.emit(event);
  }

  makeDirectory(): void {
    if (this.addNewDir.value.path) this.mkdir.emit(posix.join(this.node.path, this.addNewDir.value.path));
    this.modals.mkDir = false;
  }

  closeModals(event: MouseEvent) {
    event.stopPropagation();
    this.modals.closeAll();
  }


  ngOnInit(): void {
    this.modals.closeAll();
    this.fileTreeEvents.add(
      this._lfts.activeItemPath
      .pipe(filter((path) => !!path))
      .pipe(map((path: string) => {
        return { path, name: basename(path) };
      })).subscribe((file: FilePathName) => {
        this.fileSelect.emit(file);
      }),
    );
    this._lfts.activeItemPath.next(this.current);
  }
  ngOnDestroy(): void {
    this.fileTreeEvents.unsubscribe();
    this._lfts.activeItemPath.next(null);
  }
}
