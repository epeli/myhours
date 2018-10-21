import {
    configureStore,
    createReducer,
    makeThunkCreator,
} from "@epeli/redux-stack";
import {bindActionCreators} from "redux";
import {makeComponentCreator} from "redux-render-prop";

import {SimpleActions} from "./actions";
import {initialState, Selectors, State} from "./state";

export const createMyHoursThunk = makeThunkCreator(store => ({
    getSelectors: () => new Selectors(store.getState() as typeof initialState),
    dispatch: store.dispatch,
}));

export const createMyHoursConnect = makeComponentCreator({
    prepareState: (state: State) => new Selectors(state),

    prepareActions: dispatch => {
        return bindActionCreators(SimpleActions, dispatch);
    },
});

export function createMyHoursStore() {
    return configureStore({
        reducers: [createReducer(SimpleActions)],
    });
}
