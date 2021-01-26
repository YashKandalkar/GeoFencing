import React from "react";
import { Image, View, ImageBackground } from "react-native";
import DraggableRouter from "./DraggableRouter";

const GeoFencingMap = ({
    image,
    routers,
    actualToPixelFactor,
    routerInfoHandler,
    geoFencePixelDimensionsHandler,
    routerLimits,
    setRouterLimits
}) => {
    const aspectRatio = image.width / image.height;
    return (
        <ImageBackground
            source={{ uri: image.uri }}
            resizeMode="contain"
            onLayout={({ nativeEvent: { layout } }) => {
                console.log({ layout, aspectRatio });
                setRouterLimits({
                    x: layout.x - 8,
                    y: layout.y - 7,
                    w: layout.width + 28,
                    h: layout.height + 7
                });
                geoFencePixelDimensionsHandler({
                    horizontal: layout.width,
                    vertical: layout.height
                });
            }}
            style={{
                // width: "100%",
                // height: "100%",
                // justifyContent: "center",
                // alignItems: "center",
                // position: "absolute",
                // // backgroundColor: "transparent",
                // zIndex: -10,
                // elevation: -10,
                // padding: 0,
                // margin: 0,
                // overflow: "hidden",
                height: image.height > image.width ? "100%" : undefined,
                aspectRatio: image.width / image.height,
                width: image.width > image.height ? "100%" : undefined,
                // flex: 1,
                zIndex: -20,
                borderColor: "red",
                borderWidth: 4,
                marginHorizontal: "auto",
                maxHeight: 210,
                overflow: "hidden"
            }}
        >
            {routers.map((router, index) => (
                <DraggableRouter
                    key={index}
                    bounds={routerLimits}
                    onDragEnd={(coordinates) => {
                        console.log(coordinates);
                        routerInfoHandler(
                            {
                                horizontal:
                                    (coordinates[0] - 13.973922729492188) /
                                    actualToPixelFactor.horizontal,
                                vertical:
                                    (coordinates[1] + 6.80328369140625) /
                                    actualToPixelFactor.vertical
                            },
                            index
                        );
                    }}
                    value={{
                        horizontal:
                            router.horizontal * actualToPixelFactor.horizontal,
                        vertical:
                            router.vertical * actualToPixelFactor.vertical,
                        range: {
                            horizontal:
                                router.range * actualToPixelFactor.horizontal,
                            vertical:
                                router.range * actualToPixelFactor.vertical
                        }
                    }}
                />
            ))}
            {/*<Image*/}
            {/*    source={{ uri: image.uri }}*/}
            {/*    resizeMode="contain"*/}
            {/*    onLayout={({ nativeEvent: { layout } }) => {*/}
            {/*        console.log({ layout, aspectRatio });*/}
            {/*        setRouterLimits({*/}
            {/*            x: layout.x - 8,*/}
            {/*            y: layout.y - 7,*/}
            {/*            w: layout.width + 28,*/}
            {/*            h: layout.height + 7*/}
            {/*        });*/}
            {/*        geoFencePixelDimensionsHandler({*/}
            {/*            horizontal: layout.width,*/}
            {/*            vertical: layout.height*/}
            {/*        });*/}
            {/*    }}*/}
            {/*    style={{*/}
            {/*        height: image.height > image.width ? "100%" : "100%",*/}
            {/*        aspectRatio: image.width / image.height,*/}
            {/*        width: image.width > image.height ? "100%" : undefined,*/}
            {/*        // flex: 1,*/}
            {/*        zIndex: -20,*/}
            {/*        borderColor: "red",*/}
            {/*        // borderWidth: 4,*/}
            {/*        marginHorizontal: "auto",*/}
            {/*        maxHeight: 210,*/}
            {/*        overflow: "hidden"*/}
            {/*    }}*/}
            {/*/>*/}
        </ImageBackground>
    );
};

export default GeoFencingMap;
