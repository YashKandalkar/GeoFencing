import React from "react";
import { Image, View } from "react-native";
import { DragResizeBlock } from "react-native-drag-resize";

const DraggableRouter = ({ imageBounds }) => {
    return (
        <View>
            <DragResizeBlock
                isResizable={false}
                connectors={["c"]}
                w={10}
                limitation={{
                    x: imageBounds.x - 7,
                    y: imageBounds.y - 7,
                    w: imageBounds.width + 7,
                    h: imageBounds.height + 7
                }}
            >
                <View
                    style={{
                        alignItems: "center",
                        paddingTop: 10
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

export default DraggableRouter;
