import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServerlogMonitorComponent } from './serverlog-monitor.component';

const routes: Routes = [{ path: '', component: ServerlogMonitorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServerlogMonitorRoutingModule { }
