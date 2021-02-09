export interface WsMessage {
  event: 'reboot-server' | 'launch-server' | 'stop-server';
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
  token?: string,
  id?: number,
  role?: string,
  gr?: number,
  name?: string,
  avatar?: string
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
export interface LogLine {
  unix: number;
  date: string;
  process: string;
  nickname?: string;
  id: number;
  geo?: GeoData;
  content?: string;
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
}

export interface TreeNode {
  items?: TreeNode[];
  path: string;
  name: string;
  type: string;
  expanded?: boolean;
}
