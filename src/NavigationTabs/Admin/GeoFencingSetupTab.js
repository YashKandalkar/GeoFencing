import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import { connect } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { useDebounce } from "../../utils/hooks";
import { DragResizeBlock, DragResizeContainer } from "react-native-drag-resize";

import {
    Surface,
    Subheading,
    Headline,
    Divider,
    Button,
    Paragraph
} from "react-native-paper";

import {
    NumericFormItem,
    Scroll,
    OutlinedContainer,
    DraggableRouter,
    GeoFencingRouter
} from "../../components";

const GeoFencingSetupTab = ({ adminHospitalSetupDone }) => {
    const [image, setImage] = useState(null);
    const [imageBounds, setImageBounds] = useState(null);
    const [dragBlockLimits, setDragBlockLimits] = useState({
        x: 0,
        y: 0,
        w: 0,
        h: 0
    });
    const [actualToPixelFactor, setActualToPixelFactor] = useState({
        horizontal: 0,
        vertical: 0
    });
    console.log(actualToPixelFactor);
    const [boundingRectDimensions, setBoundingRectDimensions] = useState({
        horizontal: 5000,
        vertical: 5000
    });

    const [routers, setRouterInfo] = useState([
        {
            horizontal: 0,
            vertical: 0,
            height: 0
        }
    ]);

    const [geoFenceDimensions, setGeoFenceDimensions] = useState({
        horizontal: 0,
        vertical: 0
    });

    const [geoFencePosition, setGeoFencePosition] = useState({
        x: 0,
        y: 0
    });

    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                try {
                    const {
                        status
                    } = await ImagePicker.requestCameraRollPermissionsAsync();
                    if (status !== "granted") {
                        alert(
                            "Sorry, we need camera roll permissions to make this work!"
                        );
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1
        });

        if (!result.cancelled) {
            setImage(result);
        }
    };

    const geoFencePositionHandler = useDebounce(500, (position) => {
        setGeoFencePosition({ ...position });
    });

    const geoFenceDimensionsHandler = useDebounce(500, (dimension) => {
        setGeoFenceDimensions({ ...dimension });
        if (
            boundingRectDimensions.horizontal !== 0 &&
            boundingRectDimensions.vertical !== 0
        ) {
            setActualToPixelFactor({
                horizontal:
                    dimension.horizontal / boundingRectDimensions.horizontal -
                    0.0058,
                vertical:
                    dimension.vertical / boundingRectDimensions.vertical - 0.009
            });
        }
    });

    useEffect(() => {
        if (
            boundingRectDimensions.horizontal !== 0 &&
            boundingRectDimensions.vertical !== 0 &&
            geoFenceDimensions.horizontal !== 0 &&
            geoFenceDimensions.vertical !== 0
        ) {
            const ratios = {
                horizontal:
                    geoFenceDimensions.horizontal /
                        boundingRectDimensions.horizontal -
                    0.0058,
                vertical:
                    geoFenceDimensions.vertical /
                        boundingRectDimensions.vertical -
                    0.009
            };
            setRouterInfo((state) => {
                return state.map((el) => {
                    console.log(
                        el.horizontal,
                        actualToPixelFactor.horizontal,
                        ratios.horizontal
                    );
                    console.log(
                        (el.horizontal * actualToPixelFactor.horizontal) /
                            ratios.horizontal,
                        el.horizontal
                    );
                    return {
                        horizontal:
                            (el.horizontal * actualToPixelFactor.horizontal) /
                            ratios.horizontal,
                        vertical:
                            (el.vertical * actualToPixelFactor.vertical) /
                            ratios.vertical,
                        height: el.height
                    };
                });
            });
            setActualToPixelFactor(ratios);
        }
    }, [boundingRectDimensions.horizontal, boundingRectDimensions.vertical]);

    const routerInfoHandler = (val, ind) => {
        let newArr = [...routers];
        newArr[ind] = {
            horizontal: val.horizontal || routers[ind].horizontal,
            vertical: val.vertical || routers[ind].vertical,
            height: val.height || routers[ind].height
        };
        setRouterInfo(newArr);
    };

    return (
        <Scroll>
            <View style={{ flex: 1 }}>
                {!adminHospitalSetupDone ? (
                    <Surface style={styles.setupWarningContainer}>
                        <Subheading>
                            Please complete the hospital setup first!
                        </Subheading>
                    </Surface>
                ) : (
                    <Surface style={styles.mainContainer}>
                        <Surface
                            style={{
                                paddingVertical: 8,
                                justifyContent: "center"
                            }}
                        >
                            <Headline style={{ marginLeft: 8 }}>
                                GeoFencing Setup
                            </Headline>
                            <Divider
                                style={{
                                    marginHorizontal: 8,
                                    marginTop: 4,
                                    marginBottom: 16
                                }}
                            />
                            <View
                                style={{
                                    borderColor: "#555",
                                    borderWidth: 3,
                                    padding: 8,
                                    margin: 4,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 210
                                }}
                            >
                                {image ? (
                                    <View
                                        style={{
                                            flex: 1,
                                            width: "100%",
                                            position: "relative"
                                        }}
                                    >
                                        <Image
                                            source={{ uri: image.uri }}
                                            resizeMode="contain"
                                            onLayout={(event) => {
                                                setImageBounds({
                                                    ...event.nativeEvent.layout
                                                });
                                            }}
                                            style={{
                                                height: "100%",
                                                maxHeight: 210
                                            }}
                                        />
                                        {imageBounds && (
                                            <DragResizeContainer
                                                onInit={(limits) =>
                                                    setDragBlockLimits({
                                                        ...limits,
                                                        y: limits.y - 7,
                                                        h: limits.h + 10
                                                    })
                                                }
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    position: "absolute"
                                                }}
                                            >
                                                <DragResizeBlock
                                                    x={imageBounds.x}
                                                    y={imageBounds.y - 7}
                                                    w={imageBounds.width}
                                                    h={imageBounds.height + 10}
                                                    onResizeEnd={(args) =>
                                                        geoFencePositionHandler(
                                                            {
                                                                x: args[0],
                                                                y: args[1]
                                                            }
                                                        )
                                                    }
                                                    onDragEnd={(args) =>
                                                        geoFencePositionHandler(
                                                            {
                                                                x: args[0],
                                                                y: args[1]
                                                            }
                                                        )
                                                    }
                                                    limitation={dragBlockLimits}
                                                >
                                                    <View
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            backgroundColor:
                                                                "transparent",
                                                            borderColor: "red",
                                                            borderWidth: 4
                                                        }}
                                                        onLayout={({
                                                            nativeEvent
                                                        }) =>
                                                            geoFenceDimensionsHandler(
                                                                {
                                                                    horizontal:
                                                                        nativeEvent
                                                                            .layout
                                                                            .width,
                                                                    vertical:
                                                                        nativeEvent
                                                                            .layout
                                                                            .height
                                                                }
                                                            )
                                                        }
                                                    />
                                                </DragResizeBlock>
                                                {routers.map(
                                                    (router, index) => (
                                                        <DraggableRouter
                                                            key={index}
                                                            bounds={
                                                                dragBlockLimits
                                                            }
                                                            onDragEnd={(
                                                                coordinates
                                                            ) => {
                                                                routerInfoHandler(
                                                                    {
                                                                        horizontal:
                                                                            Math.pow(
                                                                                actualToPixelFactor.horizontal,
                                                                                -1
                                                                            ) *
                                                                            coordinates[0],
                                                                        vertical:
                                                                            Math.pow(
                                                                                actualToPixelFactor.vertical,
                                                                                -1
                                                                            ) *
                                                                            coordinates[1]
                                                                    },
                                                                    index
                                                                );
                                                            }}
                                                            value={{
                                                                horizontal:
                                                                    router.horizontal *
                                                                    actualToPixelFactor.horizontal,
                                                                vertical:
                                                                    router.vertical *
                                                                    actualToPixelFactor.vertical
                                                            }}
                                                        />
                                                    )
                                                )}
                                            </DragResizeContainer>
                                        )}
                                    </View>
                                ) : (
                                    <Subheading>
                                        Select the floor-map of your hospital!
                                    </Subheading>
                                )}
                            </View>
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    marginVertical: 8
                                }}
                            >
                                {image && (
                                    <Button
                                        mode={"outlined"}
                                        onPress={() => setImage(null)}
                                        style={{ marginRight: 8 }}
                                    >
                                        Clear
                                    </Button>
                                )}
                                <Button mode={"contained"} onPress={pickImage}>
                                    Pick an image
                                </Button>
                            </View>
                            <View
                                style={{
                                    margin: 8
                                }}
                            >
                                <Headline>Fill in the dimensions:</Headline>
                                <Divider style={{ marginBottom: 8 }} />
                                <Paragraph>
                                    These are real world dimensions of the
                                    bounding rectangle (Red coloured). All the
                                    positions of objects inside the floor-map
                                    will be relative to this rectangle.
                                </Paragraph>
                                <Paragraph>
                                    You can resize the rectangle above but these
                                    dimensions will not be affected.
                                </Paragraph>
                                <OutlinedContainer
                                    containerStyle={{ marginTop: 8 }}
                                >
                                    <NumericFormItem
                                        labelText={
                                            "Bounding Rectangle Horizontal Length:"
                                        }
                                        inputProps={{
                                            minValue: 5000,
                                            rounded: true,
                                            step: 100,
                                            totalWidth: 150,
                                            type: "up-down",
                                            inputStyle: {
                                                fontSize: 14
                                            },
                                            totalHeight: 50
                                        }}
                                        onChange={(val) =>
                                            setBoundingRectDimensions(
                                                ({ vertical }) => ({
                                                    vertical,
                                                    horizontal: val
                                                })
                                            )
                                        }
                                        helperText={"(in meters)"}
                                        labelStyle={{ fontSize: 16 }}
                                        value={
                                            boundingRectDimensions.horizontal
                                        }
                                    />
                                    <NumericFormItem
                                        labelText={
                                            "Bounding Rectangle Vertical Length:"
                                        }
                                        inputProps={{
                                            minValue: 5000,
                                            rounded: true,
                                            step: 100,
                                            totalWidth: 150,
                                            type: "up-down",
                                            inputStyle: {
                                                fontSize: 14
                                            },
                                            totalHeight: 50
                                        }}
                                        onChange={(val) =>
                                            setBoundingRectDimensions(
                                                ({ horizontal }) => ({
                                                    horizontal,
                                                    vertical: val
                                                })
                                            )
                                        }
                                        helperText={"(in meters)"}
                                        labelStyle={{ fontSize: 16 }}
                                        value={boundingRectDimensions.vertical}
                                    />
                                </OutlinedContainer>
                            </View>

                            <View
                                style={{
                                    margin: 8
                                }}
                            >
                                <Headline>Add Routers:</Headline>
                                <Divider style={{ marginBottom: 8 }} />
                                <Paragraph>
                                    Add routers inside the (red) GeoFencing
                                    Rectangle which will be used to locate a
                                    patient inside the hospital.
                                </Paragraph>
                                <Paragraph>
                                    There should be a minimum of 3 routers in
                                    the hospital. Add more routers for covering
                                    larger areas.
                                </Paragraph>
                                <Paragraph>
                                    Provide the actual location of the routers
                                    inside the hospital:
                                </Paragraph>
                                {routers.map((router, index) => (
                                    <GeoFencingRouter
                                        key={index}
                                        routerNumber={index + 1}
                                        value={router}
                                        maxValue={boundingRectDimensions}
                                        onChange={(value) =>
                                            routerInfoHandler(value, index)
                                        }
                                    />
                                ))}
                            </View>
                        </Surface>
                    </Surface>
                )}
            </View>
        </Scroll>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        elevation: 1,
        flex: 1,
        // margin: 8,
        padding: 8,
        borderRadius: 8
    },
    setupWarningContainer: {
        flex: 1,
        elevation: 1,
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8
    }
});

const mapStateToProps = (state) => ({
    adminHospitalSetupDone: state.adminHospitalSetupDone
});

export default connect(mapStateToProps)(GeoFencingSetupTab);
