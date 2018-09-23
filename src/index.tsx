import React from "react";
import ReactDom from "react-dom";

const Root = () => <div>hello</div>;

const el = document.getElementById("root");

if (el) {
    ReactDom.render(<Root />, el);
}
