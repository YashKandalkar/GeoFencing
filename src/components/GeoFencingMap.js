import React from "react";
import { ImageBackground } from "react-native";
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
            source={image}
            resizeMode="contain"
            onLayout={({ nativeEvent: { layout } }) => {
                setRouterLimits({
                    x: layout.x - 15,
                    y: layout.y - 11,
                    w: layout.width + 16,
                    h: layout.height + 10
                });
                geoFencePixelDimensionsHandler({
                    horizontal: layout.width + 10,
                    vertical: layout.height
                });
            }}
            style={{
                height: image.height > image.width ? "100%" : undefined,
                aspectRatio: image.width / image.height,
                width: image.width > image.height ? "100%" : undefined,
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
                        routerInfoHandler(
                            {
                                horizontal:
                                    (coordinates[0] + 10.984113693237305) /
                                    actualToPixelFactor.horizontal,
                                vertical:
                                    (coordinates[1] + 6.903350830078125) /
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
        </ImageBackground>
    );
};

export default GeoFencingMap;
