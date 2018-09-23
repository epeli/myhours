import React from "react";

import {createEntryDate} from "../redux/state";

import Day from "./Day";

const Main = () => <Day date={createEntryDate(new Date())} />;

export default Main;
