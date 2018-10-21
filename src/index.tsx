import React from "react";
import ReactDom from "react-dom";
import {hot} from "react-hot-loader";
import {Provider} from "react-redux";
import {HashRouter as Router} from "react-router-dom";

import Main from "./components/Main";
import {createMyHoursStore} from "./redux/store";

const anyWindow = window as any;
// https://material-ui.com/style/typography/#migration-to-typography-v2
anyWindow.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

const store = createMyHoursStore();

const Root = () => (
    <Router>
        <Provider store={store}>
            <Main />
        </Provider>
    </Router>
);

const el = document.getElementById("root");

declare const module: any;

const HotRoot = hot(module)(Root);

if (el) {
    ReactDom.render(module.hot ? <HotRoot /> : <Root />, el);
} else {
    throw new Error("cannot find div#root");
}
