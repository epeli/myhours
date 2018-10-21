import {createSimpleActions} from "@epeli/redux-stack";
import {Omit, strictAssign} from "@epeli/utils";
import {last, range} from "lodash-es";

import {DayID, Entry, EntryID, initialState} from "./state";

export const SimpleActions = createSimpleActions(initialState, {
    addEntry(draftState, action: {day: DayID; entry: Entry}) {
        let entry = action.entry;
        const draftDay = draftState.days[action.day];

        if (!draftDay) {
            console.warn("Unknown day: " + action.day);
            return draftState;
        }

        const draftPrevEntry = last(draftDay.entries);

        if (draftPrevEntry) {
            if (draftPrevEntry.end) {
                entry = {...entry, start: draftPrevEntry.end};
            } else {
                // Stop previous entry
                draftPrevEntry.end = entry.start;
            }
        }

        draftDay.entries.push(entry);

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

    setEntryEnd(
        draftState,
        action: {
            day: DayID;
            entryID: EntryID;
            end: number;
        },
    ) {
        const day = draftState.days[action.day];

        if (!day) {
            console.warn("Unknown day: " + action.day);
            return draftState;
        }

        const entryIndex = day.entries.findIndex(
            _entry => _entry.id === action.entryID,
        );

        if (entryIndex === -1) {
            return draftState;
        }

        const entry = day.entries[entryIndex];

        const change = action.end - (entry.end || action.end);

        entry.end = action.end;

        if (Math.abs(change) > 0) {
            for (const index of range(entryIndex + 1, day.entries.length)) {
                const entryAfter = day.entries[index];
                entryAfter.start += change;
                if (entryAfter.end) {
                    entryAfter.end += change;
                }
            }
        }

        return draftState;
    },
});
