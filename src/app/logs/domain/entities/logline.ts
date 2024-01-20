import { UserData } from "@lars/user/domain";
import { Processes } from "../configs";

export interface ContentData {
  time?: string;
  oid?: number;
  auth?: UserData;
  dm_id?: string;
  op?: string;
  weapon?: string;
  message?: string;
  target?: {
    username: string;
    id: number;
  };
  props?: {
    [key: string]: any;
  };
  action?: string;
  targetType?: string;
  numbers?: number[];
  cn?: string;
  editor?: {
    editor_id: number;
    g: string;
    players: number;
    visitors: number;
  };
}

export interface LogLine {
  unix: number;
  date: string;
  process: keyof typeof Processes;
  nickname?: string;
  id: number;
  geo?: GeoData;
  content?: ContentData;
  multiplier?: number;
}

export interface GeoData {
  country?: string;
  cc?: string;
  ip?: string;
  as?: number;
  ss?: string;
  org?: string;
  cli?: string;
}
