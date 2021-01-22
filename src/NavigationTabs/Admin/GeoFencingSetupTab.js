import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import { connect } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { useDebounce } from "../../utils/hooks";
import { DragResizeBlock, DragResizeContainer } from "react-native-drag-resize";
import {
    setGeofencingData,
    setGeofencingSetupDone
} from "../../redux/mainReduxDuck";

import {
    Surface,
    Subheading,
    Headline,
    Button,
    Paragraph,
    HelperText
} from "react-native-paper";

import {
    NumericFormItem,
    Scroll,
    OutlinedContainer,
    DraggableRouter,
    GeoFencingRouter,
    Divider
} from "../../components";

const GeoFencingSetupTab = ({
    adminHospitalSetupDone,
    setGeofencingSetupDone,
    setGeofencingData,
    geofencingData,
    jumpTo
}) => {
    const [image, setImage] = useState(geofencingData.image ?? null);
    const [imageBounds, setImageBounds] = useState(
        geofencingData.imageBounds ?? null
    );
    const [routers, setRouterInfo] = useState(geofencingData.routers ?? []);
    const [dragBlockLimits, setDragBlockLimits] = useState(
        geofencingData.dragBlockLimits ?? {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        }
    );
    const [actualToPixelFactor, setActualToPixelFactor] = useState(
        geofencingData.actualToPixelFactor ?? {
            horizontal: 0,
            vertical: 0
        }
    );
    const [geofenceActualDimensions, setGeofenceActualDimensions] = useState(
        geofencingData.geofenceActualDimensions ?? {
            horizontal: 100,
            vertical: 100
        }
    );
    const [geoFencePixelDimensions, setGeoFencePixelDimensions] = useState(
        geofencingData.geoFencePixelDimensions ?? {
            horizontal: 0,
            vertical: 0
        }
    );

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

    const onClearClick = () => {
        setImage(null);
        setGeofencingData({
            ...geofencingData,
            image: null,
            geoFencePixelDimensions: null,
            imageBounds: null,
            dragBlockLimits: null,
            actualToPixelFactor: null
        });
    };
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

    const geoFencePixelDimensionsHandler = useDebounce(500, (dimension) => {
        setGeoFencePixelDimensions({ ...dimension });
        if (
            geofenceActualDimensions.horizontal !== 0 &&
            geofenceActualDimensions.vertical !== 0
        ) {
            setActualToPixelFactor({
                horizontal:
                    dimension.horizontal / geofenceActualDimensions.horizontal -
                    0.0058,
                vertical:
                    dimension.vertical / geofenceActualDimensions.vertical -
                    0.009
            });
        }
    });

    useEffect(() => {
        if (
            geofenceActualDimensions.horizontal !== 0 &&
            geofenceActualDimensions.vertical !== 0 &&
            geoFencePixelDimensions.horizontal !== 0 &&
            geoFencePixelDimensions.vertical !== 0
        ) {
            const ratios = {
                horizontal:
                    geoFencePixelDimensions.horizontal /
                        geofenceActualDimensions.horizontal -
                    0.0058,
                vertical:
                    geoFencePixelDimensions.vertical /
                        geofenceActualDimensions.vertical -
                    0.009
            };
            setRouterInfo((state) => {
                return state.map((el) => {
                    return {
                        ...el,
                        horizontal:
                            (el.horizontal * actualToPixelFactor.horizontal) /
                            ratios.horizontal,
                        vertical:
                            (el.vertical * actualToPixelFactor.vertical) /
                            ratios.vertical
                    };
                });
            });
            setActualToPixelFactor(ratios);
        }
    }, [
        geofenceActualDimensions.horizontal,
        geofenceActualDimensions.vertical
    ]);

    const routerInfoHandler = (val, ind) => {
        let newArr = [...routers];
        newArr[ind] = { ...routers[ind], ...val };
        setRouterInfo(newArr);
    };

    const onRouterAdd = () => {
        let newRouterArr = [...routers];
        newRouterArr.push({
            horizontal: 0,
            vertical: 0,
            height: 0,
            range: 20
        });
        setRouterInfo(newRouterArr);
    };

    const onRouterDelete = (ind) => {
        let newRouterArr = [...routers];
        newRouterArr.splice(ind, 1);
        setRouterInfo(newRouterArr);
    };

    const onNextClick = () => {
        setGeofencingData({
            image,
            imageBounds,
            routers,
            dragBlockLimits,
            actualToPixelFactor,
            geoFencePixelDimensions,
            geofenceActualDimensions
        });
        setGeofencingSetupDone(true);
        jumpTo("doctorTab");
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
                                    zIndex: 10,
                                    // elevation: 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    minHeight: 210
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
                                                height: "100%"
                                                // maxHeight: 210
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
                                                    isResizable={false}
                                                    connectors={[]}
                                                    x={imageBounds.x}
                                                    y={imageBounds.y - 7}
                                                    w={imageBounds.width}
                                                    h={imageBounds.height + 17}
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
                                                            geoFencePixelDimensionsHandler(
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
                                                                            coordinates[0] /
                                                                            actualToPixelFactor.horizontal,
                                                                        vertical:
                                                                            coordinates[1] /
                                                                            actualToPixelFactor.vertical
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
                                                                    actualToPixelFactor.vertical,
                                                                range: {
                                                                    horizontal:
                                                                        router.range *
                                                                        actualToPixelFactor.horizontal,
                                                                    vertical:
                                                                        router.range *
                                                                        actualToPixelFactor.vertical
                                                                }
                                                            }}
                                                        />
                                                    )
                                                )}
                                            </DragResizeContainer>
                                        )}
                                    </View>
                                ) : (
                                    <Subheading style={{ marginVertical: 90 }}>
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
                                        onPress={onClearClick}
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
                                <OutlinedContainer
                                    containerStyle={{ marginTop: 8 }}
                                >
                                    <NumericFormItem
                                        labelText={
                                            "Bounding Rectangle Horizontal Length:"
                                        }
                                        inputProps={{
                                            minValue: 10,
                                            rounded: true,
                                            step: 10,
                                            totalWidth: 150,
                                            type: "up-down",
                                            inputStyle: {
                                                fontSize: 14
                                            },
                                            totalHeight: 50
                                        }}
                                        onChange={(val) =>
                                            setGeofenceActualDimensions(
                                                ({ vertical }) => ({
                                                    vertical,
                                                    horizontal: val
                                                })
                                            )
                                        }
                                        helperText={"(in meters)"}
                                        labelStyle={{ fontSize: 16 }}
                                        value={
                                            geofenceActualDimensions.horizontal
                                        }
                                    />
                                    <NumericFormItem
                                        labelText={
                                            "Bounding Rectangle Vertical Length:"
                                        }
                                        inputProps={{
                                            minValue: 10,
                                            rounded: true,
                                            step: 10,
                                            totalWidth: 150,
                                            type: "up-down",
                                            inputStyle: {
                                                fontSize: 14
                                            },
                                            totalHeight: 50
                                        }}
                                        onChange={(val) =>
                                            setGeofenceActualDimensions(
                                                ({ horizontal }) => ({
                                                    horizontal,
                                                    vertical: val
                                                })
                                            )
                                        }
                                        helperText={"(in meters)"}
                                        labelStyle={{ fontSize: 16 }}
                                        value={
                                            geofenceActualDimensions.vertical
                                        }
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
                                    inside the hospital.
                                </Paragraph>
                                {routers.map((router, index) => (
                                    <GeoFencingRouter
                                        key={index}
                                        routerNumber={index + 1}
                                        value={router}
                                        maxValue={geofenceActualDimensions}
                                        onDelete={onRouterDelete}
                                        onChange={(value) =>
                                            routerInfoHandler(value, index)
                                        }
                                    />
                                ))}
                                <View
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: 16
                                    }}
                                >
                                    <Button
                                        mode={"contained"}
                                        onPress={onRouterAdd}
                                    >
                                        Add Router
                                    </Button>
                                </View>
                            </View>
                        </Surface>
                        <Divider
                            dividerStyle={{
                                marginBottom: routers.length < 3 ? 0 : 8
                            }}
                        />
                        {routers.length < 3 && (
                            <HelperText
                                style={{ marginTop: 8 }}
                                visible={routers.length < 3}
                                type={"error"}
                            >
                                At least 3 routers are needed to locate a
                                patient inside the hospital. Please add{" "}
                                {3 - routers.length} more router(s)!
                            </HelperText>
                        )}
                        <View style={styles.formButtonsContainer}>
                            <Button
                                style={styles.formButton}
                                mode={"contained"}
                                onPress={onNextClick}
                                disabled={routers.length < 3}
                            >
                                Next
                            </Button>
                        </View>
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
        // elevation: 1,
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8
    },
    formButtonsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    formButton: {
        marginRight: 16,
        marginTop: 8,
        marginBottom: 8
    }
});

const mapStateToProps = (state) => ({
    adminHospitalSetupDone: state.adminHospitalSetupDone,
    geofencingData: state.geofencingData
});

const mapDispatchToProps = (dispatch) => {
    return {
        setGeofencingSetupDone: (val) => dispatch(setGeofencingSetupDone(val)),
        setGeofencingData: (val) => dispatch(setGeofencingData(val))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GeoFencingSetupTab);
