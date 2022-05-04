import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LibertyIconsModule } from '../liberty-icons/liberty-icons.module';
import { FileTreeComponent } from './file-tree/file-tree.component';
import { FileTreeItemComponent } from './file-tree-item/file-tree-item.component';
import { FileTreeItemsComponent } from './file-tree-items/file-tree-items.component';
import { LtyFileTreeService } from './lty-file-tree.service';
import { DndDirective } from '../directives/dnd.directive';
import { AutofocusDirective } from '../directives/autofocus.directive';

@NgModule({
  declarations: [
    FileTreeComponent,
    FileTreeItemComponent,
    FileTreeItemsComponent,
    DndDirective,
    AutofocusDirective,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    LibertyIconsModule
  ],
  providers: [ LtyFileTreeService ],
  exports: [FileTreeComponent, FileTreeItemComponent, FileTreeItemsComponent]
})
export class LtyFileTreeModule { }
