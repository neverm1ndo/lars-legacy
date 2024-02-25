import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServerlogMonitorRoutingModule } from './serverlog-monitor-routing.module';
import { ServerlogMonitorComponent } from './serverlog-monitor.component';

@NgModule({
  declarations: [ServerlogMonitorComponent],
  imports: [CommonModule, ServerlogMonitorRoutingModule]
})
export class ServerlogMonitorModule {}
