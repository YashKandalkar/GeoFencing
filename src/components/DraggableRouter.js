import React from "react";
import { Image, View } from "react-native";
import { DragResizeBlock } from "react-native-drag-resize";
import PropTypes from "prop-types";

const DraggableRouter = ({ bounds, onDragEnd, value }) => {
    console.log("DraggableRouter: update bounds", bounds);
    return (
        <View>
            <DragResizeBlock
                isResizable={false}
                connectors={["c"]}
                w={10}
                h={10}
                x={Math.round(value.horizontal)}
                y={Math.round(value.vertical)}
                onDragEnd={onDragEnd}
                limitation={{
                    x: bounds.x - 7,
                    y: bounds.y - 7,
                    w: bounds.w + 7,
                    h: bounds.h + 30
                }}
            >
                <View
                    style={{
                        alignItems: "center",
                        // paddingTop: 10,
                        backgroundColor: "#000"
                    }}
                >
                    <Image
                        source={require("../assets/wifi-router.png")}
                        style={{
                            width: 25,
                            height: 25
                        }}
                    />
                </View>
            </DragResizeBlock>
        </View>
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
