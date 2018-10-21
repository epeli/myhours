import * as datefns from "date-fns/esm";
import {values} from "lodash-es";

import {Branded, notEmpty} from "../utils";

export type ProjectID = Branded<"project", string>;
export type DayID = Branded<"day", string>;
export type EntryID = Branded<"entry", string>;

export function createDayID(date: Date): DayID {
    return datefns.format(date, "YYYY-MM-dd") as DayID;
}

export function entryDateAsDate(date: DayID): Date {
    return datefns.parse(date as string, "YYYY-MM-dd", new Date());
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
    projectID: ProjectID;
    comment: string;
    duration?: number;
    interval?: {start: number; end: number};
}

export interface Day {
    id: DayID;
    daySaves: boolean;
    entries: Entry[];
}

export interface State {
    projects: {
        [projectId: string]: Project | undefined;
    };

    days: {
        [day: string]: Day | undefined;
    };
}

export const initialState: State = {
    projects: {
        foo: {
            id: "foo" as ProjectID,
            name: "Project Foo",
        },
        bar: {
            id: "bar" as ProjectID,
            name: "Project Bar",
        },
    },

    days: {
        [createDayID(new Date("2018-10-21"))]: {
            id: createDayID(new Date("2018-10-21")),
            daySaves: false,
            entries: [
                {
                    id: "boo" as EntryID,
                    projectID: "bar" as ProjectID,
                    comment: "testi",
                    duration: 2.4,
                },
                {
                    id: "bar" as EntryID,
                    projectID: "bar" as ProjectID,
                    comment: "bar juttu",
                    duration: 2.4,
                },
            ],
        },
    },
};

export class Selectors {
    state: State;

    constructor(state: State) {
        this.state = state;
    }

    getEntryIDs(date: DayID): EntryID[] {
        return this.getEntries(date).map(entry => entry.id);
    }

    getEntry(date: DayID, id: EntryID): Entry | undefined {
        const day = this.state.days[date];
        if (!day) {
            return;
        }

        return day.entries.find(entry => entry.id == id);
    }

    getEntries(date: DayID): Entry[] {
        const day = this.state.days[date];
        if (!day) {
            return [];
        }

        return day.entries;
    }

    getProjects() {
        return values(this.state.projects).filter(notEmpty);
    }
}
