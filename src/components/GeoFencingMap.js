import React, { useState, useEffect } from "react";
import { ImageBackground, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import DraggableRouter from "./DraggableRouter";
import { DragResizeBlock } from "react-native-drag-resize";
import { useDebounce } from "../utils/hooks";

const GeoFencingMap = ({
    image,
    routers,
    actualToPixelFactor,
    routerInfoHandler,
    geoFencePixelDimensionsHandler,
    routerLimits,
    setRouterLimits,
    geofenceProps,
    setGeofenceProps,
    setSnackbarConfig
}) => {
    const [loadComponents, setLoadComponents] = useState(false);
    const [loading, setLoading] = useState(true);
    const [firstLayout, setFirstLayout] = useState(true);
    const unsaved = useDebounce(50, () => {
        setSnackbarConfig({
            content: "Unsaved Changes! Don't forget to click SAVE GEOFENCE!",
            type: "WARNING"
        });
    });
    const positionChange = useDebounce(50, (x, y) => {
        setGeofenceProps({
            ...geofenceProps,
            x,
            y
        });
        unsaved();
    });
    const dimensionChange = useDebounce(500, (w, h) => {
        setGeofenceProps({
            ...geofenceProps,
            width: w,
            height: h
        });
        unsaved();
    });
    useEffect(() => {
        let timer = setTimeout(() => {
            setLoadComponents(true);
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return loadComponents || !loading ? (
        <ImageBackground
            source={image}
            resizeMode="contain"
            onLoadEnd={() => {
                setLoading(false);
                setLoadComponents(false);
            }}
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
                height: image.height >= image.width ? "100%" : undefined,
                aspectRatio: image.width / image.height,
                width: image.width > image.height ? "100%" : undefined,
                zIndex: -20,
                borderColor: "red",
                borderWidth: 4,
                marginHorizontal: "auto",
                maxHeight: 210,
                overflow: "hidden",
                display: loading ? "none" : "flex"
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
            <DragResizeBlock
                x={geofenceProps?.x ?? routerLimits.x}
                y={geofenceProps?.y ?? routerLimits.y}
                w={
                    geofenceProps?.width + 14 ??
                    routerLimits.w + Math.abs(routerLimits.x)
                }
                h={
                    geofenceProps?.height + 14 ??
                    routerLimits.h + Math.abs(routerLimits.y)
                }
                limitation={routerLimits}
                onDragEnd={(xy) => positionChange(...xy)}
                onResizeEnd={(xy) => positionChange(...xy)}
            >
                <View
                    style={{
                        width: "100%",
                        height: "100%",
                        borderWidth: 4,
                        borderColor: "purple",
                        backgroundColor: "rgba(114,0,221, 0.3)"
                    }}
                    onLayout={({ nativeEvent: { layout } }) => {
                        firstLayout
                            ? setFirstLayout(false)
                            : dimensionChange(layout.width, layout.height);
                    }}
                />
            </DragResizeBlock>
        </ImageBackground>
    ) : (
        <ActivityIndicator />
    );
};

export default GeoFencingMap;
