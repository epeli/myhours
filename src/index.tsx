import React from "react";
import ReactDom from "react-dom";
import {Provider} from "react-redux";

import Main from "./components/Main";
import {createMyHoursStore} from "./redux/store";

const Root = () => (
    <Provider store={createMyHoursStore()}>
        <Main />
    </Provider>
);

const el = document.getElementById("root");

if (el) {
    ReactDom.render(<Root />, el);
}
