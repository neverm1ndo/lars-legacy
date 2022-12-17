import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigEditorComponent } from './config-editor/config-editor.component';
import { EmptyDocComponent } from '../empty-doc/empty-doc.component';
import { BinaryDocComponent } from './binary-doc/binary-doc.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { NotChangedDocumentGuard } from '@lars/guards/not-changed-document.guard';

const routes: Routes = [
  { path: '', component: ConfigEditorComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'empty'},
    { path: 'empty', component: EmptyDocComponent },
    { path: 'binary', component: BinaryDocComponent },
    { path: 'doc', component: TextEditorComponent, canDeactivate: [NotChangedDocumentGuard] }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigsRoutingModule { }
