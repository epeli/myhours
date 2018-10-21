import {configureStore, createReducer} from "@epeli/redux-stack";

import {SimpleActions} from "./actions";

export function createMyHoursStore() {
    return configureStore({
        reducers: [createReducer(SimpleActions)],
    });
}
