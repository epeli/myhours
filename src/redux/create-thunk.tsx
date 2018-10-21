import {makeThunkCreator} from "@epeli/redux-stack";

import {initialState, Selectors, State} from "./state";

export const createMyHoursThunk = makeThunkCreator(store => ({
    getSelectors: () => new Selectors(store.getState() as typeof initialState),
    getState: () => store.getState() as State,
    dispatch: store.dispatch,
}));
