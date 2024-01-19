import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

import { selectors as UserSelectors } from "../state/user.selectors";

@Injectable()
export class UserFacade {

    constructor(private store: Store) {}

    getUserSettings() {
        return this.store.select(UserSelectors.selectUserSettings);
    }
}