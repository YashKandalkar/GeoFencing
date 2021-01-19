import React, { useState, useEffect } from "react";
import { Image } from "react-native";
import { DragResizeBlock } from "react-native-drag-resize";
import PropTypes from "prop-types";

const DraggableRouter = ({ bounds, onDragEnd, value }) => {
    const [temp, setTemp] = useState(0);
    useEffect(() => {
        let mounted = true;
        if (mounted) {
            setTemp(temp + 1);
        }
        return () => {
            mounted = false;
        };
    }, [value.vertical, value.horizontal, bounds]);
    return (
        <DragResizeBlock
            isResizable={false}
            connectors={["c"]}
            w={25}
            h={25}
            x={
                value.horizontal > bounds.x
                    ? bounds.x
                    : Math.round(value.horizontal)
            }
            y={
                value.vertical > bounds.y
                    ? bounds.y
                    : Math.round(value.vertical)
            }
            onDragEnd={onDragEnd}
            limitation={{ ...bounds, h: bounds.h + 10, w: bounds.w + 7 }}
        >
            <Image
                source={require("../assets/wifi-router.png")}
                style={{
                    width: 25,
                    height: 25
                }}
            />
        </DragResizeBlock>
    );
};

DraggableRouter.defaultProps = {
    value: {
        horizontal: 0,
        vertical: 0
    }
};

DraggableRouter.propTypes = {
    onDragEnd: PropTypes.func.isRequired,
    value: PropTypes.object,
    bounds: PropTypes.object.isRequired
};

export default DraggableRouter;
