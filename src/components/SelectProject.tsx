import {Typography} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React from "react";
import styled from "react-emotion";

import {Project, ProjectID} from "../redux/state";
import {createMyHoursComponent} from "../redux/store";

import {Row, View} from "./core";

const ProjectsConnect = createMyHoursComponent({
    mapState: s => s.getProjects(),
});

const Container = styled(Row)({
    alignItems: "center",
});

const ITEM_HEIGHT = 48;

interface SelectProjectProps {
    project: null | Project;
    onChange: (project: Project) => void;
}

class SelectProject extends React.Component<SelectProjectProps> {
    state = {
        anchorEl: null,
    };

    handleClick = (event: any) => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    getProjectName() {
        if (!this.props.project) {
            return "Valitse...";
        }

        return this.props.project.name;
    }

    render() {
        const {anchorEl} = this.state;
        const open = Boolean(anchorEl);

        return (
            <Container>
                <Typography component="p">{this.getProjectName()}</Typography>
                <View>
                    <IconButton
                        aria-label="More"
                        aria-owns={open ? "long-menu" : undefined}
                        aria-haspopup="true"
                        onClick={this.handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={this.handleClose}
                        PaperProps={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: 200,
                            },
                        }}
                    >
                        <ProjectsConnect
                            render={data =>
                                data.map(project => (
                                    <MenuItem
                                        key={project.id}
                                        selected={Boolean(
                                            this.props.project &&
                                                project.id ===
                                                    this.props.project.id,
                                        )}
                                        onClick={e => {
                                            this.props.onChange(project);
                                            this.handleClose();
                                        }}
                                    >
                                        {project.name}
                                    </MenuItem>
                                ))
                            }
                        />
                    </Menu>
                </View>
            </Container>
        );
    }
}

export default SelectProject;
