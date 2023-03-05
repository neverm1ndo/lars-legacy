import Processes from '@lars/shared/components/line-process/log-processes';
import { Workgroup } from '@lars/enums/workgroup.enum';

export interface IUserLoginData {
  email: string,
  password: string
}
export interface IUserData {
  id?: number,
  username?: string,
  avatar?: string
  main_group?: Workgroup,
  secondary_group?: Workgroup,
  token: string,
}
export interface IGeoData {
  country?: string;
  cc?: string;
  ip?: string;
  as?: number;
  ss?: string;
  org?: string;
  cli?: string;
}
export interface IContentData {
  time?: string;
  oid?: number;
  auth?: IUserData;
  dm_id?: string;
  op?: string;
  weapon?: string;
  message?: string;
  target?: {
    username: string;
    id: number;
  },
  props?: {
    [key: string]: any;
  },
  action?: string;
  targetType?: string;
  numbers?: number[];
}
export interface LogLine {
  unix: number;
  date: string;
  process: keyof typeof Processes;
  nickname?: string;
  id: number;
  geo?: IGeoData;
  content?: IContentData;
  multiplier?: number;
}

export interface ISearchQuery {
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

export interface ITreeNode {
  items?: ITreeNode[];
  path: string;
  name: string;
  type: string;
  expanded?: boolean;
}

export interface HistoryStorageItem {
  [key: number | string]: string;
}

export interface HistoryStorage {
  [key: number]: HistoryStorageItem[]
}
