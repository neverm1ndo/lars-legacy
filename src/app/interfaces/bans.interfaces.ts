import { BanType } from "@lars/enums/bans.enum";

export interface BanRule {
    id: number;
    rule: string;
    ban_type: BanType;
    ip: string;
    serial_cn?: string;
    serial_as?: string;
    serial_ss?: string;
    user_id?: number;
    banned_username: string;
    admin_id: number;
    admin_avatar: string;
    admin_username: string;
    banned_from: Date;
    banned_to: Date | null;
  }