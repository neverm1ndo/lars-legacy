import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BackupsComponent } from './backups.component';

const routes: Routes = [{ path: '', component: BackupsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackupsRoutingModule { }
