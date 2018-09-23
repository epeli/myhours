import React from "react";

import {EntryDate} from "../redux/state";
import {createMyHoursComponent} from "../redux/store";

const EntryConnect = createMyHoursComponent({
    mapActions: actions => ({
        addEntry: actions.addEntry,
    }),
});

const AddEntry = (props: {date: EntryDate}) => (
    <div>
        <EntryConnect render={_ => <div>sdfd</div>} />
    </div>
);

export default AddEntry;
