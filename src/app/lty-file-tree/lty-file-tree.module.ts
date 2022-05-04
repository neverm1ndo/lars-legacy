import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileTreeComponent } from './file-tree/file-tree.component';
import { FileTreeItemComponent } from './file-tree-item/file-tree-item.component';
import { FileTreeItemsComponent } from './file-tree-items/file-tree-items.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LibertyIconsModule } from '../liberty-icons/liberty-icons.module'


@NgModule({
  declarations: [
    FileTreeComponent,
    FileTreeItemComponent,
    FileTreeItemsComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbModule,
    LibertyIconsModule
  ],
  providers: [],
  exports: [FileTreeComponent, FileTreeItemComponent, FileTreeItemsComponent]
})
export class LtyFileTreeModule { }
