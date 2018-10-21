import * as datefns from "date-fns/esm";
import {deburr} from "lodash-es";

import {DayID, EntryID, ProjectID} from "./state";

export function createDayID(date: Date): DayID {
    return datefns.format(date, "yyy-MM-dd") as DayID;
}
export function entryDateAsDate(dayID: DayID): Date {
    return datefns.parse(dayID as string, "YYYY-MM-dd", new Date());
}
export function generateEntryId(): EntryID {
    return String(Math.random()) as EntryID;
}

export function createProjectId(name: string): ProjectID {
    const id = deburr(name)
        .trim()
        .replace(/[^a-z]+/g, "-");

    return id as ProjectID;
}
