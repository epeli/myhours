import {notEmpty} from "@epeli/utils";
import {values} from "lodash-es";
import React from "react";
import styled, {css} from "react-emotion";
import {MappedActions} from "redux-render-prop";

import {createMyHoursConnect} from "../redux/create-connect";
import {DayID, Project} from "../redux/state";
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

const flexSelect = css({
    flex: 1,
});

const initialState = {inputValue: "", maybeCreateProject: ""};

class AddEntry extends React.Component<{day: DayID}, typeof initialState> {
    state = initialState;

    render() {
        return (
            <EntryConnect render={(...args) => this.renderInputs(...args)} />
        );
    }

    handleInputChange = (value: string) => {
        if (value.trim()) {
            this.setState({maybeCreateProject: value});
        }
        this.setState({inputValue: value});
    };

    renderInputs(_: unknown, actions: MappedActions<typeof EntryConnect>) {
        return (
            <Row>
                <ProjectsConnect
                    render={projects => (
                        <SelectItem
                            className={String(flexSelect)}
                            inputValue={this.state.inputValue}
                            items={values(projects)
                                .filter(notEmpty)
                                .map(p => ({label: p.name, id: p.id}))}
                            onInputValueChange={this.handleInputChange}
                            onSelect={project => {
                                this.setState({inputValue: ""});
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
                <CreateProject name={this.state.maybeCreateProject} />
            </Row>
        );
    }
}

export default AddEntry;
