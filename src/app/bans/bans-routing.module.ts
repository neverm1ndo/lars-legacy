import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BanhammerComponent } from './containers/banhammer/banhammer.component';

const routes: Routes = [{ path: '', component: BanhammerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BansRoutingModule {}
