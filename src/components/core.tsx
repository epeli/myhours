import styled from "react-emotion";

export const View = styled.div({
    display: "flex",
    position: "relative",
    boxSizing: "border-box",
    flexDirection: "column",
});

export const Row = styled(View)({
    flexDirection: "row",
});
