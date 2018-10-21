import {DayID, EntryID} from "./state";
export function createDayID(date: Date): DayID {
    return datefns.format(date, "YYYY-MM-dd") as DayID;
}
export function entryDateAsDate(date: DayID): Date {
    return datefns.parse(date as string, "YYYY-MM-dd", new Date());
}
export function generateEntryId(): EntryID {
    return String(Math.random()) as EntryID;
}
