import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import Slider from "@material-ui/lab/Slider";
import * as datefns from "date-fns";
import {debounce} from "lodash-es";
import {rem} from "polished";
import React from "react";
import styled from "react-emotion";
import {MappedActions} from "redux-render-prop";

import {createMyHoursConnect} from "../redux/create-connect";
import {DayID, Entry, EntryID, ProjectID} from "../redux/state";

import {Row, View} from "./core";

const EntryConnect = createMyHoursConnect({
    mapState: (selectors, props: {day: DayID; id: EntryID}) => {
        const nextEntry = selectors.getNextEntry(props.day, props.id);
        return {
            entry: selectors.getEntry(props.day, props.id) || null,
            isNextRunning: nextEntry ? !nextEntry.end : false,
        };
    },
    mapActions: (actions, props) => ({
        setEntryStart(start: number) {
            actions.setEntryStart({dayID: props.day, entryID: props.id, start});
        },
        setEntryEnd(end: number) {
            actions.setEntryEnd({dayID: props.day, entryID: props.id, end});
        },
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

const TitleContainer = styled(View)({
    flexDirection: "row",
    alignItems: "center",
});

const TimeRow = styled(View)({
    flexDirection: "row",
    alignItems: "center",
});

const SliderContainer = styled(View)({
    padding: rem(16),
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
        <span>
            {Math.floor(minutes / 60)} hours {Math.round(minutes % 60)} minutes
        </span>
    );
};

interface Props {
    day: DayID;
    entry: Entry;
    isNextRunning: boolean;
    setEntryStart: MappedActions<typeof EntryConnect>["setEntryStart"];
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
        this.setState({sliderValue: value});
        this.debounceStoreUpdate();
    };

    debounceStoreUpdate = debounce(() => {
        if (typeof this.state.sliderValue !== "number") {
            return;
        }

        this.props.setEntryEnd(
            this.props.entry.start + this.state.sliderValue * 60 * 1000,
        );

        this.setState({sliderValue: null});
    }, 500);

    handleStop = () => {
        this.props.setEntryEnd(Date.now());
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
                <ProjectConnect
                    id={entry.projectID}
                    render={data => (
                        <TitleContainer>
                            <Typography variant="h5">{data.name} </Typography>
                            <View style={{width: rem(16)}} />
                            <Typography variant="body2">
                                <Duration duration={this.getDuration()} />
                            </Typography>
                            {/* {datefns.format(entry.start, "HH:mm")}
                                {" - "}
                                {entry.end
                                    ? datefns.format(
                                          entry.start + this.getDuration(),
                                          "HH:mm",
                                      )
                                    : "now..."} */}
                        </TitleContainer>
                    )}
                />
                <SliderContainer>
                    {this.props.entry.end
                        ? this.renderSlider()
                        : this.renderStopButton()}
                </SliderContainer>

                <TimeRow>
                    <TextField
                        type="time"
                        required
                        onChange={e => {
                            const parsed = datefns.parse(
                                e.target.value,
                                "HH:mm",
                                new Date(this.props.day),
                            );
                            this.props.setEntryStart(parsed.getTime());
                        }}
                        value={datefns.format(entry.start, "HH:mm")}
                    />
                    <Typography variant="body2">{" to "}</Typography>
                    {entry.end ? (
                        <TextField
                            type="time"
                            required
                            value={datefns.format(entry.end, "HH:mm")}
                            onChange={e => {
                                const parsed = datefns.parse(
                                    e.target.value,
                                    "HH:mm",
                                    new Date(this.props.day),
                                );
                                this.props.setEntryEnd(parsed.getTime());
                            }}
                        />
                    ) : (
                        "NOW"
                    )}
                </TimeRow>

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
                    setEntryStart={actions.setEntryStart}
                />
            ) : (
                "not found: " + props.id
            )
        }
    />
);

export default EntryWrap;
