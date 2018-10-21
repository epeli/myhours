import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from "react";

import {DayID, EntryID, ProjectID} from "../redux/state";
import {createMyHoursConnect} from "../redux/store";

const EntryConnect = createMyHoursConnect({
    mapState: (selectors, props: {day: DayID; id: EntryID}) =>
        selectors.getEntry(props.day, props.id) || null,
});

const ProjectConnect = createMyHoursConnect({
    mapState: (selectors, props: {id: ProjectID}) =>
        selectors.getProject(props.id),
});

const Entry = (props: {day: DayID; id: EntryID}) => (
    <EntryConnect
        day={props.day}
        id={props.id}
        render={entry =>
            entry ? (
                <Card>
                    <CardContent>
                        <Typography variant="headline" component="h2">
                            <ProjectConnect
                                id={entry.projectID}
                                render={data => data.name}
                            />
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
