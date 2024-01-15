import { Injectable } from "@angular/core";
import { IOutputAreaSizes } from "angular-split";

@Injectable({
  providedIn: "root",
})
export class PanesService {
  constructor() {}

  public savePanesState(
    event: { gutterNum: number | "*"; sizes: IOutputAreaSizes },
    key: string,
  ): void {
    window.localStorage.setItem(key, JSON.stringify(event.sizes));
  }

  public getPanesState(key: string): number[] {
    try {
      const states = JSON.parse(window.localStorage.getItem(key));
      if (!states) throw "undefined states";
      return states;
    } catch (err) {
      console.error(err);
      return [20, 80];
    }
  }
}
