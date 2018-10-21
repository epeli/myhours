import {debounce} from "lodash-es";
import React from "react";

import {createMyHoursConnect} from "../redux/create-connect";

const StateConnect = createMyHoursConnect({
    mapState: s => s.state,
    mapActions: actions => ({
        debouncePersist: debounce(actions.persists, 5000),
        load: actions.loadState,
    }),
});

interface AnyChildren {
    children: React.ReactNode;
}

class BlockUpdates extends React.Component<AnyChildren> {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return this.props.children;
    }
}

class Loading extends React.Component<{onMount: Function}> {
    componentDidMount() {
        this.props.onMount();
    }

    render() {
        return "Loading...";
    }
}

const PersistenceProvider = (props: AnyChildren) => (
    <StateConnect
        render={(state, actions) => {
            actions.debouncePersist();

            if (state.restored) {
                return <BlockUpdates>{props.children}</BlockUpdates>;
            }

            return <Loading onMount={actions.load} />;
        }}
    />
);

export default PersistenceProvider;
