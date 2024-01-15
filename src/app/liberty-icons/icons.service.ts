import { Injectable } from "@angular/core";
import { LibertyIcon } from "./icons/icons.lib";

@Injectable({
  providedIn: "root",
})
export class IconsService {
  private registry = new Map<string, string>();

  public regIcons(icons: LibertyIcon[]): void {
    icons.forEach((icon: LibertyIcon) =>
      this.registry.set(icon.name, icon.data),
    );
  }

  constructor() {}

  getIcon(iconName: string): string | undefined {
    if (!this.registry.has(iconName)) {
      console.warn(`Icon with name '${iconName}' is not registered.`);
    }
    return this.registry.get(iconName);
  }
}
