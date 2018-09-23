import Button from "@material-ui/core/Button";
import React from "react";
import ReactDom from "react-dom";
import {Provider} from "react-redux";

import {createMyHoursStore} from "./redux/store";

const Root = () => (
    <Provider store={createMyHoursStore()}>
        <Button variant="contained" color="primary">
            Hello World
        </Button>
    </Provider>
);

const el = document.getElementById("root");

if (el) {
    ReactDom.render(<Root />, el);
}
