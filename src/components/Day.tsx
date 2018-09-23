import React from "react";

import {EntryDate} from "../redux/state";
import {createMyHoursComponent} from "../redux/store";

import AddEntry from "./AddEntry";
import Entry from "./Entry";

const EntriesConnect = createMyHoursComponent({
    mapState: (selectors, props: {date: EntryDate}) => ({
        entryIDs: selectors.getEntryIDs(props.date),
    }),
});

const Day = (props: {date: EntryDate}) => (
    <div>
        <EntriesConnect
            date={props.date}
            render={data => data.entryIDs.map(id => <Entry key={id} id={id} />)}
        />
        <AddEntry date={props.date} />
    </div>
);

export default Day;
