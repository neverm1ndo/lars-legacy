import { BackupAction } from "../enums/backup.action.enum";

export interface Backup {
    unix: number;
    date: Date,
    expires: Date,
    action: BackupAction,
    user: {
      nickname: string;
      group_id: string;
    },
    file: {
      binary: boolean;
      name: string;
      mime: string;
      path: string;
      text?: string;
    }
  };