import {createSimpleActions} from "@epeli/redux-stack";
import {Omit, strictAssign} from "@epeli/utils";
import * as idb from "idb-keyval";
import {last, range} from "lodash-es";

import {createMyHoursThunk} from "./create-thunk";
import {DayID, Entry, EntryID, initialState, ProjectID, State} from "./state";
import {createProjectId} from "./state-tools";

export const SimpleActions = createSimpleActions(initialState, {
    restore(_, action: {state: State}) {
        return {...action.state, restored: true};
    },

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

    addProject(draftState, action: {name: string}) {
        const id = createProjectId(action.name);

        draftState.projects[id] = {
            id: id,
            name: action.name,
        };

        return draftState;
    },
});

export const Thunks = {
    persists: createMyHoursThunk(() => async store => {
        await idb.set("myhours", store.getState());
        console.log("Saved");
    }),

    loadState: createMyHoursThunk(() => async store => {
        const state = await idb.get<State>("myhours");
        if (state) {
            store.dispatch(SimpleActions.restore({state}));
        } else {
            store.dispatch(
                SimpleActions.restore({
                    state: {...initialState, restored: true},
                }),
            );
        }
    }),
};
