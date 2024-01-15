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
  geo?: IGeoData;
  content?: IContentData;
  multiplier?: number;
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
