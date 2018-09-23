import {createSimpleActions} from "@epeli/redux-stack";

import {Entry, initialState} from "./state";

export const SimpleActions = createSimpleActions(initialState, {
    setCount(draftState, action: {newCount: number}) {
        return draftState;
    },

    addEntry(draftState, action: {entry: Entry}) {
        draftState.entries[action.entry.id] = action.entry;
        return draftState;
    },
});
