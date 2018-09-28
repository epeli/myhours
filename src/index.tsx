import React from "react";
import ReactDom from "react-dom";
import {Provider} from "react-redux";
import {HashRouter as Router} from "react-router-dom";

import Main from "./components/Main";
import {createMyHoursStore} from "./redux/store";

const Root = () => (
    <Router>
        <Provider store={createMyHoursStore()}>
            <Main />
        </Provider>
    </Router>
);

const el = document.getElementById("root");

if (el) {
    ReactDom.render(<Root />, el);
}
