import * as datefns from "date-fns/esm";
import {values} from "lodash-es";

import {Branded, notEmpty} from "../utils";

export type ProjectID = Branded<"project", string>;
export type EntryDate = Branded<"entry-date", string>;
export type EntryID = Branded<"entry", string>;

export function createEntryDate(date: Date): EntryDate {
    return datefns.format(date, "YYYY-MM-DD") as EntryDate;
}

export function entryDateAsDate(date: EntryDate): Date {
    return datefns.parse(date as string, "YYYY-MM-DD", new Date());
}

export function generateEntryId(): EntryID {
    return String(Math.random()) as EntryID;
}

export interface Project {
    id: ProjectID;
    name: string;
}

export interface Entry {
    id: EntryID;
    date: EntryDate;
    projectID: ProjectID;
    comment: string;
    duration?: number;
    interval?: {start: number; end: number};
}

export interface State {
    projects: {
        [projectId: string]: Project | undefined;
    };

    entries: {
        [entryId: string]: Entry | undefined;
    };
}

export const initialState: State = {
    projects: {
        foo: {
            id: "foo" as ProjectID,
            name: "Foo",
        },
        bar: {
            id: "bar" as ProjectID,
            name: "Bar",
        },
    },
    entries: {
        boo: {
            id: "boo" as EntryID,
            date: createEntryDate(new Date()),
            projectID: "bar" as ProjectID,
            comment: "testi",
            duration: 2.4,
        },
        bar: {
            id: "bar" as EntryID,
            date: createEntryDate(new Date()),
            projectID: "bar" as ProjectID,
            comment: "bar juttu",
            duration: 2.4,
        },
    },
};

export class Selectors {
    state: State;

    constructor(state: State) {
        this.state = state;
    }

    getEntryIDs(date: EntryDate): EntryID[] {
        return this.getEntries(date).map(entry => entry.id);
    }

    getEntry(id: EntryID) {
        return this.state.entries[id];
    }

    getEntries(date: EntryDate): Entry[] {
        return values(this.state.entries)
            .filter(notEmpty)
            .filter(entry => entry.date === date);
    }

    getProjects() {
        return values(this.state.projects).filter(notEmpty);
    }
}
