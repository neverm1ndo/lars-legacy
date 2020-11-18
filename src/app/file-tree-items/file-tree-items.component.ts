import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../api.service';
import { TreeNode } from '../interfaces/app.interfaces'

@Component({
  selector: 'file-tree-items',
  templateUrl: './file-tree-items.component.html',
  styleUrls: ['./file-tree-items.component.scss']
})
export class FileTreeItemsComponent implements OnInit {

  @Input('child-nodes') nodes: TreeNode;
  @Input('expanded') expanded: boolean;
  @Input('current') current: string;
  @Output() chooseFileEvent = new EventEmitter<{path: string, name: string}>();

  toggler: boolean = false;

  fa = {
    dir: faFolder,
  }
  getConfig(path: {path: string, name: string}) {
    this.chooseFileEvent.emit(path);
  }

  toggleExpand(event: Event):void {
    event.stopPropagation();
    event.preventDefault();
    this.toggler = !this.toggler;
  }


  constructor( public api: ApiService) {
  }

  ngOnInit(): void {
    if (this.expanded) this.toggler = true;
  }

}
