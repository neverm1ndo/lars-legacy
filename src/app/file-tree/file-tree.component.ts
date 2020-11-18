import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeNode } from '../interfaces/app.interfaces';

@Component({
  selector: 'file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss']
})
export class FileTreeComponent implements OnInit {

  @Input('items') node: TreeNode;
  @Output() chooseFileEvent = new EventEmitter<string>();
  @Input('current') current: string;

  constructor() { }

  getConfig(path: string) {
    this.chooseFileEvent.emit(path);
  }

  ngOnInit(): void {
  }

}
