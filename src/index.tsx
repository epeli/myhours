import React from "react";
import ReactDom from "react-dom";
import {Provider} from "react-redux";
import {HashRouter as Router} from "react-router-dom";

import Main from "./components/Main";
import PersistenceProvider from "./components/PersistenceProvider";
import {createMyHoursStore} from "./redux/store";

const anyWindow = window as any;
// https://material-ui.com/style/typography/#migration-to-typography-v2
anyWindow.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

const store = createMyHoursStore();

const Root = () => (
    <Router>
        <Provider store={store}>
            <PersistenceProvider>
                <Main />
            </PersistenceProvider>
        </Provider>
    </Router>
);

const el = document.getElementById("root");

declare const module: any;

if (el) {
    ReactDom.render(<Root />, el);
} else {
    throw new Error("cannot find div#root");
}
