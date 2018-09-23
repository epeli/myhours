import {Branded} from "../utils";

export type ProjectID = Branded<"project", string>;
export type EntryDate = Branded<"entry-date", string>;
export type EntryID = Branded<"entry", string>;

export interface Project {
    id: ProjectID;
    name: string;
}

export interface Entry {
    id: EntryID;
    date: EntryDate;
    project: ProjectID;
    duration?: number;
    interval?: {start: number; end: number};
}

export interface State {
    projects: {
        [key: string]: Project | undefined;
    };

    entries: {
        [key: string]: Entry | undefined;
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
    entries: {},
};

export class Selectors {
    state: State;

    constructor(state: State) {
        this.state = state;
    }
}
