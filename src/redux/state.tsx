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
    start: number;
    end?: number;
}

export interface Day {
    id: DayID;
    daySaves: boolean;
    entries: Entry[];
}

export interface State {
    restored: boolean;

    projects: {
        [projectId: string]: Project | undefined;
    };

    days: {
        [day: string]: Day | undefined;
    };
}

export const initialState: State = {
    restored: false,
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
                    id: "1" as EntryID,
                    projectID: "bar" as ProjectID,
                    comment: "testi",
                    start: new Date("2018-10-21 09:12").getTime(),
                    end: new Date("2018-10-21 12:44").getTime(),
                },
                {
                    id: "2" as EntryID,
                    projectID: "bar" as ProjectID,
                    comment: "testi jo",
                    start: new Date("2018-10-21 12:44").getTime(),
                    end: new Date("2018-10-21 14:01").getTime(),
                },
                {
                    id: "3" as EntryID,
                    projectID: "bar" as ProjectID,
                    comment: "bar juttu",
                    start: new Date("2018-10-21 14:01").getTime(),
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

    getNextEntry(date: DayID, id: EntryID): Entry | undefined {
        const day = this.state.days[date];

        if (!day) {
            return;
        }

        const entryIndex = day.entries.findIndex(entry => entry.id == id);

        return day.entries[entryIndex + 1];
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

    getProject(id: ProjectID) {
        const project = this.state.projects[id];

        if (!project) {
            throw new Error("Unknown project ID: " + id);
        }

        return project;
    }
}
