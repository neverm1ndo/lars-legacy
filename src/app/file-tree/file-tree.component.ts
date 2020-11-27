import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeNode } from '../interfaces/app.interfaces';
import { faPlus, faSyncAlt } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss']
})
export class FileTreeComponent implements OnInit {

  @Input('items') node: TreeNode;
  @Output() chooseFileEvent = new EventEmitter<string>();
  @Output() addNew = new EventEmitter<Event>();
  @Output() resync = new EventEmitter<any>();
  @Input('current') current: string;

  fa = {
    plus: faPlus,
    sync: faSyncAlt
  }

  constructor() { }

  getConfig(path: string) {
    this.chooseFileEvent.emit(path);
  }

  sync(): void {
    this.resync.emit();
  }

  upload(event: Event): void {
    this.addNew.emit(event);
  }

  ngOnInit(): void {
  }

}
