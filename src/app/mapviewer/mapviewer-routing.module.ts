import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { Flat2dmapComponent } from './flat2dmap/flat2dmap.component';
import { DocumentTipsComponent } from '@lars/shared/components/document-tips/document-tips.component';

const routes: Routes = [
  { 
    path: '',
    component: ShellComponent,
    children: [
      { path: '', component: DocumentTipsComponent },
      { path: 'flat', component: Flat2dmapComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapViewerRoutingModule { }
