import * as datefns from "date-fns";
import React from "react";
import {Route, RouteProps, Switch} from "react-router-dom";

import {createDayID} from "../redux/state-tools";

import Day from "./Day";
import Week from "./Week";

function foo(options: {year: string; week: string}) {
    let date = new Date();
    date = datefns.setWeek(date, Number(options.week));
    date = datefns.setYear(date, Number(options.year));
    return createDayID(date);
}

const Main = () => (
    <Switch>
        <Route
            path="/day/:year/:month/:day"
            render={route => (
                <Day
                    id={createDayID(
                        new Date(
                            `${route.match.params.year}-${
                                route.match.params.month
                            }-${route.match.params.day}`,
                        ),
                    )}
                />
            )}
        />
        <Route
            path="/week/:year/:week"
            render={route => (
                <Week
                    year={Number(route.match.params.year)}
                    week={Number(route.match.params.week)}
                />
            )}
        />
    </Switch>
);

export default Main;
