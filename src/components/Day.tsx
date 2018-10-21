import React from "react";
import styled from "react-emotion";

import {createMyHoursConnect} from "../redux/create-connect";
import {DayID} from "../redux/state";

import AddEntry from "./AddEntry";
import {View} from "./core";
import Entry from "./Entry";

const EntriesConnect = createMyHoursConnect({
    mapState: (selectors, props: {date: DayID}) => ({
        entryIDs: selectors.getEntryIDs(props.date),
    }),
});

const Container = styled(View)({
    flex: 1,
    height: "100%",
    alignItems: "space-between",
});

const Day = (props: {id: DayID}) => (
    <Container>
        <AddEntry day={props.id} />
        <EntriesConnect
            date={props.id}
            render={data =>
                data.entryIDs.map(id => (
                    <Entry key={id} day={props.id} id={id} />
                ))
            }
        />
    </Container>
);

export default Day;
