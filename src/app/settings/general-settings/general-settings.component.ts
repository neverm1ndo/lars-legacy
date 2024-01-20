import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { IGeoData, IUserData } from "@lars/interfaces";
import { UserService } from "@lars/user/domain/infrastructure/user.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-general-settings",
  templateUrl: "./general-settings.component.html",
  styleUrls: ["./general-settings.component.scss"],
})
export class GeneralSettingsComponent implements OnInit {
  constructor(private _user: UserService) {}

  public date: Date = new Date();

  public sampleGeo: IGeoData = {
    country: "Russian Federation",
    cc: "RU",
    ip: "127.0.0.1",
    as: 12345,
    ss: "8C5EE8AAFD459854D8F9DDCC5A4E8C",
    org: "Rostelecom OJSC",
    cli: "0.3.7",
  };

  get $user(): BehaviorSubject<IUserData> {
    return this._user.loggedInUser$;
  }

  public settings: FormGroup = new FormGroup({
    tray: new FormControl(false),
    lineChunk: new FormControl(100),
    listStyle: new FormControl("small"),
    textEditorStyle: new FormControl("dracula"),
  });

  public textplain: string = `# Create a safe reference to the Underscore object for use below.
  _ = (obj) -> new wrapper(obj)
  # Export the Underscore object for **CommonJS**.
  if typeof(exports) != 'undefined' then exports._ = _
  # Export Underscore to global scope.
  root._ = _

  # Current version.
  _.VERSION = '1.1.0'`;

  public chunkSizes: { id: number; val: number }[] = [
    { id: 0, val: 100 },
    { id: 1, val: 200 },
    { id: 2, val: 300 },
    { id: 3, val: 400 },
    { id: 4, val: 500 },
  ];

  public textHighlight: { id: number; val: string }[] = [
    { id: 0, val: "dracula" },
    { id: 1, val: "material" },
    { id: 2, val: "nord" },
    { id: 3, val: "panda" },
    { id: 4, val: "cobalt" },
    { id: 5, val: "ayu" },
    { id: 6, val: "yonce" },
  ];

  get listStyle(): string {
    return this.settings.value.listStyle;
  }
  get textEditorStyle(): string {
    return this.settings.value.textEditorStyle;
  }

  public codemirrorSettings = {
    lineNumbers: true,
    lineWrapping: true,
    mode: "coffeescript",
    theme: this.textEditorStyle,
    readOnly: true,
  };

  public setup() {
    let newSets = this.settings.getRawValue();
    window.localStorage.setItem("settings", JSON.stringify(newSets));
    this.codemirrorSettings.theme = newSets.textEditorStyle;
  }

  public openAccountSettings(): void {
    this._user.openUserForumProfileSettings();
  }

  ngOnInit(): void {
    const { tray, lineChunk, listStyle, textEditorStyle } =
      this._user.getUserSettings();
    this.settings.setValue({ tray, lineChunk, listStyle, textEditorStyle });
    this.setup();
  }
}
