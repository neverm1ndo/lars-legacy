import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { settingsRoute } from "../app.animations";
import { RouterOutlet } from "@angular/router";
import { Observable, from } from "rxjs";
import { ElectronService } from "@lars/core/services";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
  animations: [settingsRoute],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  constructor(private _electron: ElectronService) {}

  public $version: Observable<string> = from(
    this._electron.ipcRenderer.invoke("version"),
  );

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.["animation"];
  }

  ngOnInit(): void {}
}
