import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
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
  @Input('items') set nodes(nodes: TreeNode) {
    this.node = this._lfts.expandIfExpandedBefore(nodes);
  };
  @Output() fileSelect = new EventEmitter<FilePathName>();
  @Output() dirSelect = new EventEmitter<string>();
  @Output() rmdir = new EventEmitter<string>();
  @Output() mvdir = new EventEmitter<{ path: string; dest: string}>();
  @Output() mkdir = new EventEmitter<string>();
  @Output() addNew = new EventEmitter<Event>();
  @Output() resync = new EventEmitter<any>();
  @Input('current') current: string;

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

  popup: boolean = false;
  popupMv: boolean = true;

  constructor(private _lfts: LtyFileTreeService) { }


  mvDirEventHandle(path: string) {
    this.mvDirGroup.setValue({ path, dest: path });
    this.popupMv = true;
  }

  rmDir(path: string) {
    this.rmdir.emit(posix.normalize(path));
  }

  mvDir() {
    const { path, dest } = this.mvDirGroup.value;
    this.mvdir.emit({ path: posix.normalize(path), dest: posix.normalize(dest) });
    this.popupMv = false;
  }

  sync(): void {
    this.resync.emit();
  }

  upload(event: any): void {
    this.addNew.emit(event);
  }

  makeDirectory(): void {
    if (this.addNewDir.value.path) this.mkdir.emit(posix.normalize(this.addNewDir.value.path));
    this.popup = false;
  }

  ngOnInit(): void {
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
  }
}
