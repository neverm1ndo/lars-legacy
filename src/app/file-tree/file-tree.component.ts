import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { TreeNode } from '../interfaces/app.interfaces';
import { faPlus, faSyncAlt, faFile } from '@fortawesome/free-solid-svg-icons';
import Keys from '../enums/keycode.enum';

const { A } = Keys;

interface FilePathName {
  path: string,
  name?: string,
}

@Component({
  selector: 'file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss']
})
export class FileTreeComponent implements OnInit {

  @Input('items') node: TreeNode;
  @Output() chooseFileEvent = new EventEmitter<FilePathName>();
  @Output() chooseDirEvent = new EventEmitter<string>();
  @Output() addNew = new EventEmitter<Event>();
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

  fa = {
    plus: faPlus,
    sync: faSyncAlt,
    file: faFile
  }

  constructor() { }

  getConfig(path: FilePathName) {
    this.chooseFileEvent.emit(path);
  }
  chooseDir(path: string) {
    this.chooseDirEvent.emit(path);
  }

  sync(): void {
    this.resync.emit();
  }

  upload(event: any): void {
    this.addNew.emit(event);
  }

  ngOnInit(): void {
  }

}
