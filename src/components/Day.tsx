import React from "react";
import styled from "react-emotion";

import {EntryDate} from "../redux/state";
import {createMyHoursComponent} from "../redux/store";

import AddEntry from "./AddEntry";
import {View} from "./core";
import Entry from "./Entry";

const EntriesConnect = createMyHoursComponent({
    mapState: (selectors, props: {date: EntryDate}) => ({
        entryIDs: selectors.getEntryIDs(props.date),
    }),
});

const Container = styled(View)({
    flex: 1,
    height: "100%",
    alignItems: "space-between",
});

const Day = (props: {date: EntryDate}) => (
    <Container>
        hei 9
        <EntriesConnect
            date={props.date}
            render={data =>
                data.entryIDs.map(id => (
                    <Entry key={id} day={props.date} id={id} />
                ))
            }
        />
        <AddEntry date={props.date} />
    </Container>
);

export default Day;
