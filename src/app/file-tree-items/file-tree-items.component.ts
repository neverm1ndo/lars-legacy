import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

interface TreeNode {
  items: TreeNode[];
  path: string;
  name: string;
  type: string;
}

@Component({
  selector: 'file-tree-items',
  templateUrl: './file-tree-items.component.html',
  styleUrls: ['./file-tree-items.component.scss']
})
export class FileTreeItemsComponent implements OnInit {

  @Input('child-nodes') nodes: TreeNode[];
  @Input('expanded') expanded: boolean;
  @Output() chooseFileEvent = new EventEmitter<string>();

  toggler: boolean = false;

  fa = {
    dir: faFolder,
  }
  getConfig(path: string) {
    this.chooseFileEvent.emit(path);
  }

  toggleExpand(event: Event):void {
    event.stopPropagation();
    event.preventDefault();
    this.toggler = !this.toggler;
  }


  constructor() {
  }

  ngOnInit(): void {
    if (this.expanded) this.toggler = true;
  }

}
