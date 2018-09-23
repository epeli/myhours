import {createSimpleActions} from "@epeli/redux-stack";

import {initialState} from "./state";

export const SimpleActions = createSimpleActions(initialState, {
    setCount(draftState, action: {newCount: number}) {
        return draftState;
    },
});
