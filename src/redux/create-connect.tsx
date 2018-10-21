import {bindActionCreators} from "redux";
import {makeComponentCreator} from "redux-render-prop";

import {SimpleActions, Thunks} from "./actions";
import {Selectors, State} from "./state";

export const createMyHoursConnect = makeComponentCreator({
    prepareState: (state: State) => new Selectors(state),

    prepareActions: dispatch => {
        return bindActionCreators({...SimpleActions, ...Thunks}, dispatch);
    },
});
