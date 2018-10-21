import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";

import {createMyHoursConnect} from "../redux/create-connect";
import {Project, ProjectID} from "../redux/state";
import {createProjectId} from "../redux/state-tools";

const ProjectsConnect = createMyHoursConnect({
    mapState: selectors => selectors.state.projects,
    mapActions: actions => ({
        addProject(project: Project) {
            actions.addProject(project);
        },
    }),
});

const CreateProject = (props: {
    name: string;
    onCreate: (project: Project) => void;
}) => (
    <ProjectsConnect
        render={(projects, actions) => {
            if (props.name.trim().length < 5) {
                return null;
            }

            if (projects[createProjectId(props.name)]) {
                return null;
            }

            const id = createProjectId(props.name);

            return (
                <Tooltip
                    title={`Creates new project with id ${id} and adds an entry for it`}
                >
                    <Button
                        color="primary"
                        onClick={e => {
                            e.preventDefault();

                            const project = {
                                id,
                                name: props.name,
                            };
                            actions.addProject(project);
                            props.onCreate(project);
                        }}
                    >
                        Create project
                        <br />"{props.name}"
                    </Button>
                </Tooltip>
            );
        }}
    />
);

export default CreateProject;
