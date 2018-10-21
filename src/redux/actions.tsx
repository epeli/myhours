import {createSimpleActions} from "@epeli/redux-stack";

import {Entry, EntryDate, initialState} from "./state";

export const SimpleActions = createSimpleActions(initialState, {
    setCount(draftState, action: {newCount: number}) {
        return draftState;
    },

    addEntry(draftState, action: {day: EntryDate; entry: Entry}) {
        const day = draftState.days[action.day];

        if (!day) {
            console.warn("Unknown day: " + action.day);
            return draftState;
        }

        day.entries.push(action.entry);

        return draftState;
    },
});
