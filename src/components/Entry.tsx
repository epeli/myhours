import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/lab/Slider";
import * as datefns from "date-fns";
import {rem} from "polished";
import React from "react";
import styled from "react-emotion";
import {MappedActions} from "redux-render-prop";

import {SimpleActions} from "../redux/actions";
import {DayID, Entry, EntryID, ProjectID} from "../redux/state";
import {createMyHoursConnect} from "../redux/store";

import {View} from "./core";

const EntryConnect = createMyHoursConnect({
    mapState: (selectors, props: {day: DayID; id: EntryID}) =>
        selectors.getEntry(props.day, props.id) || null,
    mapActions: actions => ({
        setEntryValues: actions.setEntryValues,
    }),
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
    flexDirection: "row",
    padding: rem(16),
    margin: rem(16),
});

interface Props {
    day: DayID;
    entry: Entry;
    setEntryValues: MappedActions<typeof EntryConnect>["setEntryValues"];
}

interface State {
    sliderValue: number | null;
    // setEntryValues: typeof SimpleActions["setEntryValues"];
}

class EntryClass extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {sliderValue: null};
    }

    handleSlider = (e: unknown, value: number) => {
        this.setState({sliderValue: value});
    };

    handleSliderDragEnd = () => {
        if (typeof this.state.sliderValue !== "number") {
            return;
        }

        this.props.setEntryValues({
            day: this.props.day,
            entryID: this.props.entry.id,
            values: {
                end:
                    this.props.entry.start + this.state.sliderValue * 60 * 1000,
            },
        });

        this.setState({sliderValue: null});
    };

    getSliderValue(): number {
        if (typeof this.state.sliderValue === "number") {
            return this.state.sliderValue;
        }

        const start = this.props.entry.start;
        const end = this.props.entry.end || Date.now();

        return (end - start) / 1000 / 60;
    }

    render() {
        const {entry} = this.props;

        return (
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
                                )}{" "}
                                {!entry.end ? "and counting..." : ""}
                            </span>
                        )}
                    />
                </Typography>

                <SliderContainer>
                    {this.getSliderValue()} min
                    <Slider
                        min={0}
                        max={60 * 5}
                        step={1}
                        value={this.getSliderValue()}
                        onChange={this.handleSlider}
                        onDragEnd={this.handleSliderDragEnd}
                    />
                </SliderContainer>

                <Typography component="p">{entry.comment}</Typography>
            </Container>
        );
    }
}

const EntryWrap = (props: {day: DayID; id: EntryID}) => (
    <EntryConnect
        day={props.day}
        id={props.id}
        render={(entry, actions) =>
            entry ? (
                <EntryClass
                    day={props.day}
                    entry={entry}
                    setEntryValues={actions.setEntryValues}
                />
            ) : (
                "not found: " + props.id
            )
        }
    />
);

export default EntryWrap;
