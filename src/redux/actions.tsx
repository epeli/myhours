import {createSimpleActions} from "@epeli/redux-stack";

import {Entry, initialState} from "./state";

export const SimpleActions = createSimpleActions(initialState, {
    setCount(draftState, action: {newCount: number}) {
        return draftState;
    },

    addEntry(draftState, action: Entry) {
        draftState.entries[action.id] = action;
        return draftState;
    },
});
