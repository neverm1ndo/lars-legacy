import { Component, OnInit, Input } from '@angular/core';
import { faFileAlt } from '@fortawesome/free-regular-svg-icons';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'file-tree-item',
  templateUrl: './file-tree-item.component.html',
  styleUrls: ['./file-tree-item.component.scss']
})
export class FileTreeItemComponent implements OnInit {

  @Input('item') item: any;
  @Input('current') current: string;

  fa = {
    file: faFileAlt,
    dir: faFolder
  }

  constructor() { }

  ngOnInit(): void {
  }

}
