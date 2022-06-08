import Processes from '../shared/components/line-process/log-processes';
import { Workgroup } from '../enums/workgroup.enum';

export interface WsMessage {
  event: 'reboot-server' | 'launch-server' | 'stop-server' | 'get-status' | 'user-action';
  msg?: string,
  options?: any;
  token?: string;
}
export interface UserLoginData {
  email: string,
  password: string
}
export interface Token {
  token: string
}
export interface UserData {
  id?: number,
  username?: string,
  avatar?: string
  main_group?: Workgroup,
  secondary_group?: Workgroup,
  token?: string,
}
export interface GeoData {
  country?: string;
  cc?: string;
  ip?: string;
  as?: number;
  ss?: string;
  org?: string;
  c?: string;
}
export interface ContentData {
  time?: string,
  oid?: number,
  op?: string,
  message?: string
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

export interface SearchQuery {
  nickname?: string[];
  ip?: string[];
  dateFrom?: string,
  dateTo?: string
  process?: string[];
  as?: string;
  ss?: string;
  page?: string;
  lim?: string;
  filter?: string;
}

export interface TreeNode {
  items?: TreeNode[];
  path: string;
  name: string;
  type: string;
  expanded?: boolean;
}
