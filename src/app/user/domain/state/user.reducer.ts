import { createReducer } from "@ngrx/store";
import { UserData, UserSettings } from "../entities";

export interface UserState {
    profile: UserData;
    isAuthenticated: boolean;
    settings: UserSettings;
};

export const featureKey = 'User';

const initialState: UserState = {
    profile: {},
    isAuthenticated: false,
    settings: {
        tray: false,
        textEditor: {
            style: 'nord',
        },
        logs: {
            limit: 100
        },
        notifications: {
            general: {
                silentMode: false,
            },
            playerActions: {
                reports: true,
                kickbans: true,
            },
            serverActions: {
                shutdown: true,
                restart: true
            }
        }
    }
};

export const userReducer = createReducer(
    initialState
);