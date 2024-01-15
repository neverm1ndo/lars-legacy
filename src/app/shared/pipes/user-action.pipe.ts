import { Pipe, PipeTransform } from "@angular/core";
import { UserActivity } from "../../enums";

@Pipe({
  name: "userAction",
})
export class UserActionPipe implements PipeTransform {
  transform(value: unknown): unknown {
    const actions = {
      [UserActivity.IDLE]: "Спит",
      [UserActivity.IN_LOGS]: "Просматривает логи",
      [UserActivity.IN_MAPS]: "В редакторе карт",
      [UserActivity.REDACT]: "В редакторе конфигов",
      [UserActivity.IN_BANS]: "Просматривает баны",
      [UserActivity.IN_ADM]: "В списке админов",
      [UserActivity.IN_BACKS]: "Просматривает бэкапы",
      [UserActivity.IN_STATS]: "Просматривает статистику",
    };
    let act = actions[value as number];
    if (!act) return "Unknown Action Type";
    return act;
  }
}
