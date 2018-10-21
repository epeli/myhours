import {notEmpty} from "@epeli/utils";
import {values} from "lodash-es";
import React from "react";
import {MappedActions} from "redux-render-prop";

import {createMyHoursConnect} from "../redux/create-connect";
import {DayID} from "../redux/state";
import {generateEntryId} from "../redux/state-tools";

import {View} from "./core";
import SelectItem from "./SelectItem";

const EntryConnect = createMyHoursConnect({
    mapActions: actions => ({
        addEntry: actions.addEntry,
    }),
});

const ProjectsConnect = createMyHoursConnect({
    mapState: selectors => selectors.state.projects,
});

class AddEntry extends React.Component<{day: DayID}> {
    render() {
        return (
            <EntryConnect render={(...args) => this.renderInputs(...args)} />
        );
    }

    renderInputs(_: unknown, actions: MappedActions<typeof EntryConnect>) {
        return (
            <View>
                <ProjectsConnect
                    render={projects => (
                        <SelectItem
                            items={values(projects)
                                .filter(notEmpty)
                                .map(p => ({label: p.name, id: p.id}))}
                            onInputValueChange={() => {}}
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
            </View>
        );
    }
}

export default AddEntry;
