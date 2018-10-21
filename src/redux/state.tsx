import {values} from "lodash-es";

import {Branded, notEmpty} from "../utils";

import {createDayID} from "./state-tools";

export type ProjectID = Branded<"project", string>;
export type DayID = Branded<"day", string>;
export type EntryID = Branded<"entry", string>;

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
    projects: {},
    days: {},
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
