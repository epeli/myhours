import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/lab/Slider";
import * as datefns from "date-fns";
import {rem} from "polished";
import React from "react";
import styled from "react-emotion";

import {DayID, EntryID, ProjectID} from "../redux/state";
import {createMyHoursConnect} from "../redux/store";

import {View} from "./core";

const EntryConnect = createMyHoursConnect({
    mapState: (selectors, props: {day: DayID; id: EntryID}) =>
        selectors.getEntry(props.day, props.id) || null,
});

const ProjectConnect = createMyHoursConnect({
    mapState: (selectors, props: {id: ProjectID}) =>
        selectors.getProject(props.id),
});

const Container = styled(Paper)({
    padding: rem(16),
    margin: rem(16),
});

const SliderContainer = styled(View)({
    padding: rem(16),
    margin: rem(16),
});

const Entry = (props: {day: DayID; id: EntryID}) => (
    <EntryConnect
        day={props.day}
        id={props.id}
        render={entry =>
            entry ? (
                <Container>
                    <Typography variant="h5" component="h2">
                        <ProjectConnect
                            id={entry.projectID}
                            render={data => (
                                <span>
                                    {data.name}{" "}
                                    {datefns.format(entry.start, "HH:mm")}
                                    {" - "}
                                    {datefns.format(
                                        entry.end || Date.now(),
                                        "HH:mm",
                                    )}
                                </span>
                            )}
                        />
                    </Typography>

                    <SliderContainer>
                        <Slider
                            min={0}
                            max={60 * 5}
                            step={1}
                            value={60}
                            onChange={(e, value) => {
                                console.log("val", value);
                            }}
                        />
                    </SliderContainer>

                    <Typography component="p">{entry.comment}</Typography>
                </Container>
            ) : (
                "not found: " + props.id
            )
        }
    />
);

export default Entry;
