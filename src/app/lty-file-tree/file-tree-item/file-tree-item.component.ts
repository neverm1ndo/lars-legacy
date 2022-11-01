import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'file-tree-item',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileTreeItemComponent {
}
