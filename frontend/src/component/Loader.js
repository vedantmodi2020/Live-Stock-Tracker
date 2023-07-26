import React, { memo } from "react";
import { CircularProgress } from "@material-ui/core";

const Loader = memo((props) => {
    return (
        <div
            style={{
                ...props.style,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <CircularProgress
                color={props.color || "secondary"}
                size={props.size || 28}
                thickness={3.6}
            />
        </div>
    );
});

export default Loader;