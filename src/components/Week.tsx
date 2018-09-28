import * as datefns from "date-fns";
import {range} from "lodash-es";
import React from "react";

import {createEntryDate} from "../redux/state";

import {Row} from "./core";
import Day from "./Day";

function dateFromWeek(options: {year: number; week: number}) {
    let date = new Date();
    date = datefns.setWeek(date, options.week + 1);
    date = datefns.setYear(date, options.year);
    date = datefns.startOfWeek(date, {
        locale: {options: {weekStartsOn: 2}},
    } as any);
    // date = datefns.startOfWeek(date);
    // date = datefns.startOfISOWeek(date);
    return date;
}

const Week = (props: {year: number; week: number}) => {
    const startOfTheWeek = dateFromWeek(props);

    return (
        <Row>
            {range(7).map(num => (
                <Day
                    key={num}
                    date={createEntryDate(datefns.addDays(startOfTheWeek, num))}
                />
            ))}
        </Row>
    );
};
export default Week;
