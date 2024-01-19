import { Workgroup } from "./workgroup";

export interface UserData {
    id?: number;
    username?: string;
    avatar?: string;
    main_group?: Workgroup;
    secondary_group?: Workgroup;
    token?: string;
};

export type UserSettings = {
    tray: boolean;
    textEditor: {
        style: string;
    },
    logs: {
        limit: number;
    },
    notifications: {
        general: {
            silentMode: boolean;
        },
        playerActions: {
            reports: boolean;
            kickbans: boolean;
        },
        serverActions: {
            shutdown: boolean;
            restart: boolean;
        }
    }
}