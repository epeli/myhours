import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import Slider from "@material-ui/lab/Slider";
import * as datefns from "date-fns";
import {rem} from "polished";
import React from "react";
import styled from "react-emotion";
import {MappedActions} from "redux-render-prop";

import {createMyHoursConnect} from "../redux/create-connect";
import {DayID, Entry, EntryID, ProjectID} from "../redux/state";

import {View} from "./core";

const EntryConnect = createMyHoursConnect({
    mapState: (selectors, props: {day: DayID; id: EntryID}) => {
        const nextEntry = selectors.getNextEntry(props.day, props.id);
        return {
            entry: selectors.getEntry(props.day, props.id) || null,
            isNextRunning: nextEntry ? !nextEntry.end : false,
        };
    },
    mapActions: (actions, props) => ({
        setEntryEnd: actions.setEntryEnd,
        deleteEntry() {
            actions.deleteEntry({
                dayID: props.day,
                entryID: props.id,
            });
        },
    }),
});

const ProjectConnect = createMyHoursConnect({
    mapState: (selectors, props: {id: ProjectID}) =>
        selectors.getProject(props.id),
});

const Container = styled(View.withComponent(Paper))({
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

const ButtonContainer = styled(View)({
    position: "absolute",
    top: rem(5),
    right: rem(5),
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
    isNextRunning: boolean;
    setEntryEnd: MappedActions<typeof EntryConnect>["setEntryEnd"];
    deleteEntry: () => void;
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
        const endTime = this.props.entry.start + value * 1000 * 60;

        if (this.props.isNextRunning && endTime > Date.now()) {
            return;
        }

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
                <ButtonContainer>
                    <Tooltip placement="right" title="Remove entry">
                        <IconButton
                            onClick={() => {
                                this.props.deleteEntry();
                            }}
                        >
                            <DeleteIcon color="action" />
                        </IconButton>
                    </Tooltip>
                </ButtonContainer>
                <Typography variant="h5" component="h2">
                    <ProjectConnect
                        id={entry.projectID}
                        render={data => (
                            <span>
                                {data.name}{" "}
                                {datefns.format(entry.start, "HH:mm")}
                                {" - "}
                                {entry.end
                                    ? datefns.format(
                                          entry.start + this.getDuration(),
                                          "HH:mm",
                                      )
                                    : "now..."}
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
        render={(data, actions) =>
            data.entry ? (
                <EntryClass
                    day={props.day}
                    entry={data.entry}
                    deleteEntry={actions.deleteEntry}
                    isNextRunning={data.isNextRunning}
                    setEntryEnd={actions.setEntryEnd}
                />
            ) : (
                "not found: " + props.id
            )
        }
    />
);

export default EntryWrap;
