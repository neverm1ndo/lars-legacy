import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LogsRoutingModule } from "./logs-routing.module";
import { SharedModule } from "@lars/shared/shared.module";
import { LogsListComponent } from "./containers/logs-list/logs-list.component";
import { LogsListItemComponent } from "./containers/logs-list-item/logs-list-item.component";
import { LogsComponent } from "./containers/logs/logs.component";
import { SearchEditorComponent } from "./components/search-editor/search-editor.component";

@NgModule({
  declarations: [
    LogsListComponent,
    LogsListItemComponent,
    LogsComponent,
    SearchEditorComponent,
  ],
  imports: [CommonModule, LogsRoutingModule, SharedModule],
})
export class LogsModule {}
