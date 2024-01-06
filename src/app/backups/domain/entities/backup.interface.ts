import { BackupAction } from "@lars/backups/domain/entities/backup.action.enum";

export interface Backup {
    unix: number;
    date: Date,
    hash: string;
    expires: Date,
    action: BackupAction,
    user: {
      nickname: string;
      group_id: string;
      avatar?: string;
    },
    file: {
      binary: boolean;
      name: string;
      mime: string;
      path: string;
      text?: string;
    }
  };