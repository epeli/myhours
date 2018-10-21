import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Input from "@material-ui/core/Input";
import React from "react";
import {MappedActions} from "redux-render-prop";

import {EntryDate, generateEntryId, Project} from "../redux/state";
import {createMyHoursComponent} from "../redux/store";

import {Row, View} from "./core";
import SelectProject from "./SelectProject";

const EntryConnect = createMyHoursComponent({
    mapActions: actions => ({
        addEntry: actions.addEntry,
    }),
});

const initialState = {
    comment: "",
    project: null as Project | null,
    duration: 0,
};

class AddEntry extends React.Component<{date: EntryDate}, typeof initialState> {
    state = initialState;

    render() {
        return (
            <EntryConnect render={(...args) => this.renderInputs(...args)} />
        );
    }

    canAdd() {
        if (!this.state.project) {
            return false;
        }
        return this.state.duration > 0;
    }

    renderInputs(_: unknown, actions: MappedActions<typeof EntryConnect>) {
        return (
            <View>
                <SelectProject
                    project={this.state.project}
                    onChange={project => {
                        this.setState({project});
                    }}
                />
                <Input
                    placeholder="Kesto"
                    value={this.state.duration}
                    type="number"
                    onChange={e => {
                        this.setState({duration: Number(e.target.value)});
                    }}
                />
                <Input
                    placeholder="Comment"
                    value={this.state.comment}
                    onChange={e => {
                        this.setState({comment: e.target.value});
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!this.canAdd()}
                    onClick={() => {
                        if (!this.state.project) {
                            return;
                        }
                        actions.addEntry({
                            day: this.props.date,
                            entry: {
                                id: generateEntryId(),
                                projectID: this.state.project.id,
                                comment: this.state.comment,
                                duration: this.state.duration,
                            },
                        });
                    }}
                >
                    Send
                    <Icon>send</Icon>
                </Button>
            </View>
        );
    }
}

export default AddEntry;
