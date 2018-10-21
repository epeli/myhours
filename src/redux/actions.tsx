import {createSimpleActions} from "@epeli/redux-stack";
import {Omit, strictAssign} from "@epeli/utils";

import {DayID, Entry, EntryID, initialState} from "./state";

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

    setEntryValues(
        draftState,
        action: {
            day: DayID;
            entryID: EntryID;
            values: Partial<Omit<Entry, "id">>;
        },
    ) {
        const day = draftState.days[action.day];

        if (!day) {
            console.warn("Unknown day: " + action.day);
            return draftState;
        }

        const entry = day.entries.find(_entry => _entry.id === action.entryID);

        if (!entry) {
            return draftState;
        }

        strictAssign(entry, action.values);

        return draftState;
    },
});
