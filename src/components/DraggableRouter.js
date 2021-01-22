import React from "react";
import { Image, View } from "react-native";
import { DragResizeBlock } from "react-native-drag-resize";
import PropTypes from "prop-types";

const DraggableRouter = ({ bounds, onDragEnd, value }) => {
    return (
        <DragResizeBlock
            isResizable={false}
            connectors={["c"]}
            w={25}
            h={25}
            onDragEnd={onDragEnd}
            limitation={{ ...bounds, h: bounds.h + 10, w: bounds.w + 7 }}
        >
            <View
                style={{
                    position: "absolute",
                    left: (value.range.horizontal * 2 - 36) / -2,
                    top: (value.range.vertical * 2 - 36) / -2,
                    opacity: 0.5,
                    width: value.range.horizontal * 2,
                    height: value.range.vertical * 2,
                    borderRadius: Math.max(...Object.values(value.range)),
                    borderColor: "#13910a",
                    borderWidth: 3,
                    backgroundColor: "#69FF50"
                }}
            />
            <Image
                source={require("../assets/wifi-router.png")}
                style={{
                    position: "absolute",
                    width: 25,
                    height: 25,
                    bottom: 25,
                    left: 5
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
