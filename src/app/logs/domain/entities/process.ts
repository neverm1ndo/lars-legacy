import { Processes } from "../configs";

export interface Process {
  translate: string;
  type: ProcessTypeColor;
  control: string;
}

type ProcessTypeColor =
  | "dark"
  | "danger"
  | "success"
  | "primary"
  | "info"
  | "usual"
  | "pickup"
  | "secondary"
  | "warning"
  | "light"
  | "adm"
  | "dev"
  | "dm"
  | "tdm"
  | "derby"
  | "clothes";
