import React from "react";

import {createEntryDate} from "../redux/state";
import {createMyHoursComponent} from "../redux/store";

import Entry from "./Entry";

const EntriesConnect = createMyHoursComponent({
    mapState: (selectors, props: {date: Date}) => ({
        entryIDs: selectors.getEntryIDs(createEntryDate(props.date)),
    }),
});

const Day = () => (
    <div>
        <EntriesConnect
            date={new Date()}
            render={data => data.entryIDs.map(id => <Entry key={id} id={id} />)}
        />
    </div>
);

export default Day;
