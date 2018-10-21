import {createSimpleActions} from "@epeli/redux-stack";

import {DayID, Entry, initialState} from "./state";

export const SimpleActions = createSimpleActions(initialState, {
    setCount(draftState, action: {newCount: number}) {
        return draftState;
    },

    addEntry(draftState, action: {day: DayID; entry: Entry}) {
        const day = draftState.days[action.day];

        if (!day) {
            console.warn("Unknown day: " + action.day);
            return draftState;
        }

        day.entries.push(action.entry);

        return draftState;
    },
});
