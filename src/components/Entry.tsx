import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from "react";

import {EntryDate, EntryID} from "../redux/state";
import {createMyHoursComponent} from "../redux/store";

const EntryConnect = createMyHoursComponent({
    mapState: (selectors, props: {day: EntryDate; id: EntryID}) =>
        selectors.getEntry(props.day, props.id) || null,
});

const Entry = (props: {day: EntryDate; id: EntryID}) => (
    <EntryConnect
        day={props.day}
        id={props.id}
        render={entry =>
            entry ? (
                <Card>
                    <CardContent>
                        <Typography variant="headline" component="h2">
                            {entry.projectID}
                        </Typography>
                        <Typography component="p">{entry.comment}</Typography>
                    </CardContent>
                </Card>
            ) : (
                "not found: " + props.id
            )
        }
    />
);

export default Entry;
