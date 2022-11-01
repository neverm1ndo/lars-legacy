import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LtyFileTreeService } from '../lty-file-tree.service';
import { Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { ITreeNode } from '@lars/interfaces/app.interfaces';
import { faSyncAlt, faFile, faFolderPlus, faFileSignature } from '@fortawesome/free-solid-svg-icons';
import { settings } from '@lars/app.animations';
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

  public node: ITreeNode;

  public modals = {
    mkDir: false,
    mvDir: false,
    touch: false,
    closeAll: function() {
      Object.keys(this).forEach((key) => {
        if (typeof this[key] == 'boolean') this[key] = false;
      });
    }
  }

  @Input('current') current: string;
  @Input('canCreate') canCreate: boolean;
  @Input('items') set nodes(nodes: ITreeNode) {
    if (!nodes) return;
    this.node = this._lfts.expandFollowingDirs(nodes, this.current);
  };
  @Output() fileSelect = new EventEmitter<FilePathName>();
  @Output() dirSelect = new EventEmitter<string>();
  @Output() rmdir = new EventEmitter<string>();
  @Output() rm = new EventEmitter<string>();
  @Output() mvdir = new EventEmitter<{ path: string; dest: string }>();
  @Output() mkdir = new EventEmitter<string>();
  @Output() addNew = new EventEmitter<Event>();
  @Output() touch = new EventEmitter<string>();
  @Output() resync = new EventEmitter<any>();

  @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape': this.modals.closeAll(); break;
      default: break;
    }
  }

  private _fileTreeEvents: Subscription = new Subscription();

  addNewDir: FormGroup = new FormGroup({
    path: new FormControl('/', [
      Validators.required,
    ]),
  });

  addNewFile: FormGroup = new FormGroup({
    path: new FormControl('', [
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

  public fa = {
    sync: faSyncAlt,
    file: faFile,
    folderPlus: faFolderPlus,
    filePlus: faFileSignature
  };

  constructor(private _lfts: LtyFileTreeService) { }

  mvDirEventHandle(path: string): void {
    this.mvDirGroup.setValue({ path, dest: path });
    this.modals.mvDir = true;
  }

  rmDir(path: string) {
    this.rmdir.emit(posix.normalize(path));
  }

  rmFile(path: string) {
    this.rm.emit(posix.normalize(path));
  }

  mvDir(): void {
    const { path, dest } = this.mvDirGroup.value;
    this.mvdir.emit({ path: posix.normalize(path), dest: posix.normalize(dest) });
    this.modals.mvDir = false;
  }

  touchFile(): void {
    this.touch.emit(posix.join(this.node.path, this.addNewFile.value.path));
    this.modals.touch = false;
  }

  sync(): void {
    this.resync.emit();
  }

  upload(event: any): void {
    this.addNew.emit(event);
  }

  mkDir(): void {
    if (this.addNewDir.value.path) this.mkdir.emit(posix.join(this.node.path, this.addNewDir.value.path));
    this.modals.mkDir = false;
  }

  closeModals(event: MouseEvent): void {
    event.stopPropagation();
    this.modals.closeAll();
  }


  ngOnInit(): void {
    this.modals.closeAll();
    this._fileTreeEvents.add(
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
    this._fileTreeEvents.unsubscribe();
    this._lfts.activeItemPath.next(null);
  }
}
