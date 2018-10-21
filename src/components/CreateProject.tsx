import Button from "@material-ui/core/Button";
import React from "react";

import {createMyHoursConnect} from "../redux/create-connect";
import {createProjectId} from "../redux/state-tools";

const ProjectsConnect = createMyHoursConnect({
    mapState: selectors => selectors.state.projects,
    mapActions: actions => ({
        addProject(name: string) {
            actions.addProject({name});
        },
    }),
});

const CreateProject = (props: {name: string}) => (
    <ProjectsConnect
        render={(projects, actions) => {
            if (props.name.trim().length < 5) {
                return null;
            }

            if (projects[createProjectId(props.name)]) {
                return null;
            }

            return (
                <Button
                    onClick={e => {
                        e.preventDefault();
                        actions.addProject(props.name);
                    }}
                >
                    Create project
                    <br />"{props.name}"
                </Button>
            );
        }}
    />
);

export default CreateProject;
