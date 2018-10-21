import {notEmpty} from "@epeli/utils";
import {values} from "lodash-es";
import React from "react";
import {MappedActions} from "redux-render-prop";

import {createMyHoursConnect} from "../redux/create-connect";
import {DayID} from "../redux/state";
import {generateEntryId} from "../redux/state-tools";

import {Row, View} from "./core";
import CreateProject from "./CreateProject";
import SelectItem from "./SelectItem";

const EntryConnect = createMyHoursConnect({
    mapActions: actions => ({
        addEntry: actions.addEntry,
    }),
});

const ProjectsConnect = createMyHoursConnect({
    mapState: selectors => selectors.state.projects,
});

const initialState = {searchString: ""};

class AddEntry extends React.Component<{day: DayID}, typeof initialState> {
    state = initialState;

    render() {
        return (
            <EntryConnect render={(...args) => this.renderInputs(...args)} />
        );
    }

    handleInputChange = (value: string) => {
        if (value.trim()) {
            this.setState({searchString: value});
        }
    };

    renderInputs(_: unknown, actions: MappedActions<typeof EntryConnect>) {
        return (
            <Row>
                <ProjectsConnect
                    render={projects => (
                        <SelectItem
                            items={values(projects)
                                .filter(notEmpty)
                                .map(p => ({label: p.name, id: p.id}))}
                            onInputValueChange={this.handleInputChange}
                            onSelect={project => {
                                actions.addEntry({
                                    day: this.props.day,
                                    entry: {
                                        id: generateEntryId(),
                                        projectID: project.id,
                                        start: Date.now(),
                                        comment: "",
                                    },
                                });
                            }}
                        />
                    )}
                />
                <CreateProject name={this.state.searchString} />
            </Row>
        );
    }
}

export default AddEntry;
