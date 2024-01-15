import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DevServerControlsComponent } from "./dev-server-controls.component";
import { SharedModule } from "@lars/shared/shared.module";
import { StatusPipe } from "@lars/shared/pipes/status.pipe";
import { ServerStatGraphComponent } from "@lars/server-stat-graph/server-stat-graph.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { LibertyIconsModule } from "@lars/liberty-icons/liberty-icons.module";

@NgModule({
  declarations: [
    DevServerControlsComponent,
    StatusPipe,
    ServerStatGraphComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    FontAwesomeModule,
    LibertyIconsModule,
  ],
  exports: [DevServerControlsComponent],
})
export class DevServerControlsModule {}
