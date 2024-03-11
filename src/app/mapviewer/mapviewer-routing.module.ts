import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { Flat2dmapComponent } from './flat2dmap/flat2dmap.component';
import { TextEditorComponent } from '@lars/configs/text-editor/text-editor.component';

const routes: Routes = [
  { 
    path: '',
    component: ShellComponent,
    children: [
      { path: 'flat', component: Flat2dmapComponent },
      { path: 'xmleditor', component: TextEditorComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapViewerRoutingModule { }
