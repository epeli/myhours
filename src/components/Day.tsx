import React from "react";
import styled from "react-emotion";

import {DayID} from "../redux/state";
import {createMyHoursComponent} from "../redux/store";

import AddEntry from "./AddEntry";
import {View} from "./core";
import Entry from "./Entry";

const EntriesConnect = createMyHoursComponent({
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
        hei 9
        <EntriesConnect
            date={props.id}
            render={data =>
                data.entryIDs.map(id => (
                    <Entry key={id} day={props.id} id={id} />
                ))
            }
        />
        <AddEntry day={props.id} />
    </Container>
);

export default Day;
