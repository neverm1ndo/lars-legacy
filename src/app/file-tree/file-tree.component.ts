import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TreeNode } from '../interfaces/app.interfaces';
import { faPlus, faSyncAlt, faFile, faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import Keys from '../enums/keycode.enum';
import { settings } from '../app.animations';

const { A } = Keys;

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
export class FileTreeComponent implements OnInit {

  @Input('items') node: TreeNode;
  @Output() chooseFileEvent = new EventEmitter<FilePathName>();
  @Output() chooseDirEvent = new EventEmitter<string>();
  @Output() rmDirEvent = new EventEmitter<string>();
  @Output() addNew = new EventEmitter<Event>();
  @Output() makeDir = new EventEmitter<string>();
  @Output() resync = new EventEmitter<any>();
  @Input('current') current: string;
  @ViewChild('add') add: ElementRef;
  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {
      if (event.altKey) {
        switch (event.keyCode) {
          case A : {
            this.add.nativeElement.click();
            break;
          }
          default : break;
        }
      }
  }

  addNewDir: FormGroup = new FormGroup({
    path: new FormControl('/', [
      Validators.required,
    ]),
  });

  fa = {
    plus: faPlus,
    sync: faSyncAlt,
    file: faFile,
    folderPlus: faFolderPlus
  };

  popup: boolean = false;

  constructor() { }

  getConfig(path: FilePathName) {
    this.chooseFileEvent.emit(path);
  }

  chooseDir(path: string) {
    this.chooseDirEvent.emit(path);
  }

  rmDir(path: string) {
    this.rmDirEvent.emit(path);
  }

  sync(): void {
    this.resync.emit();
  }

  upload(event: any): void {
    this.addNew.emit(event);
  }

  mkdir(): void {
    if (this.addNewDir.value.path) this.makeDir.emit(this.addNewDir.value.path);
    this.popup = false;
  }

  ngOnInit(): void {
  }

}
