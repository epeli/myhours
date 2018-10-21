import Button from "@material-ui/core/Button";
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
        setEntryEnd: actions.setEntryEnd,
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

const ActionsContainer = styled(View)({
    alignItems: "center",
    flexDirection: "row",
});

const DurationContainer = styled(View)({
    flexDirection: "row",
    width: rem(200),
    padding: rem(16),
    margin: rem(16),
});

const Duration = (props: {duration: number}) => {
    const minutes = props.duration / 1000 / 60;
    return (
        <DurationContainer>
            <Typography variant="caption">
                {Math.floor(minutes / 60)} hours {Math.round(minutes % 60)}{" "}
                minutes
            </Typography>
        </DurationContainer>
    );
};

interface Props {
    day: DayID;
    entry: Entry;
    setEntryEnd: MappedActions<typeof EntryConnect>["setEntryEnd"];
}

interface State {
    sliderValue: number | null;
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

        this.props.setEntryEnd({
            day: this.props.day,
            entryID: this.props.entry.id,
            end: this.props.entry.start + this.state.sliderValue * 60 * 1000,
        });

        this.setState({sliderValue: null});
    };

    handleStop = () => {
        this.props.setEntryEnd({
            day: this.props.day,
            entryID: this.props.entry.id,
            end: Date.now(),
        });
    };

    getDuration(): number {
        if (typeof this.state.sliderValue === "number") {
            return this.state.sliderValue * 1000 * 60;
        }

        const start = this.props.entry.start;
        const end = this.props.entry.end || Date.now();

        return end - start;
    }

    renderSlider() {
        return (
            <>
                <Slider
                    min={0}
                    max={60 * 5}
                    step={1}
                    value={this.getDuration() / 1000 / 60}
                    onChange={this.handleSlider}
                    onDragEnd={this.handleSliderDragEnd}
                />
            </>
        );
    }

    renderStopButton() {
        return (
            <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={this.handleStop}
            >
                Stop
            </Button>
        );
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
                                    entry.start + this.getDuration(),
                                    "HH:mm",
                                )}{" "}
                                {!entry.end ? "and counting..." : ""}
                            </span>
                        )}
                    />
                </Typography>

                <ActionsContainer>
                    <Duration duration={this.getDuration()} />
                    {this.props.entry.end
                        ? this.renderSlider()
                        : this.renderStopButton()}
                </ActionsContainer>

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
                    setEntryEnd={actions.setEntryEnd}
                />
            ) : (
                "not found: " + props.id
            )
        }
    />
);

export default EntryWrap;
