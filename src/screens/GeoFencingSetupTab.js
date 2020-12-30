import React, { useState, useEffect } from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import { connect } from "react-redux";
import {
    Surface,
    Subheading,
    Headline,
    Divider,
    Button,
    Paragraph
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { DragResizeBlock } from "react-native-drag-resize";
import NumericFormItem from "../components/NumericFormItem";
import Scroll from "../components/Scroll";
import OutlinedContainer from "../components/OutlinedContainer";
import GeoFencingRouter from "../components/GeoFencingRouter";
import { useDebounce } from "../utils/hooks";

const GeoFencingSetupTab = ({ adminHospitalSetupDone }) => {
    const [image, setImage] = useState(null);
    const [imageBounds, setImageBounds] = useState(null);
    const [geoFenceDimensions, setGeoFenceDimensions] = useState({
        horizontal: null,
        vertical: null
    });

    const [geoFencePosition, setGeoFencePosition] = useState({
        x: null,
        y: null
    });

    const [
        boundingRectHorizontalLength,
        setBoundingRectHorizontalLength
    ] = useState(null);
    const [
        boundingRectVerticalLength,
        setBoundingRectVerticalLength
    ] = useState(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                try {
                    const {
                        status
                    } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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

    const geoFencePositionHandler = useDebounce(500, (dimension) => {
        setGeoFencePosition({ ...dimension });
        console.log(geoFencePosition);
    });

    const geoFenceDimensionsHandler = useDebounce(500, (position) => {
        setGeoFenceDimensions({ ...position });
        console.log(geoFenceDimensions);
    });

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
                                        <ImageBackground
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
                                        >
                                            {imageBounds && (
                                                <DragResizeBlock
                                                    x={imageBounds.x}
                                                    y={imageBounds.y}
                                                    w={imageBounds.width}
                                                    h={imageBounds.height}
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
                                                    limitation={{
                                                        x: imageBounds.x - 7,
                                                        y: imageBounds.y - 7,
                                                        w:
                                                            imageBounds.width +
                                                            7,
                                                        h:
                                                            imageBounds.height +
                                                            7
                                                    }}
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
                                            )}
                                        </ImageBackground>
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
                                            minValue: 0,
                                            rounded: true,
                                            step: 100,
                                            totalWidth: 150,
                                            type: "up-down",
                                            inputStyle: {
                                                fontSize: 14
                                            },
                                            totalHeight: 50
                                        }}
                                        onChange={
                                            setBoundingRectHorizontalLength
                                        }
                                        helperText={"(in meters)"}
                                        labelStyle={{ fontSize: 16 }}
                                        value={boundingRectHorizontalLength}
                                    />
                                    <NumericFormItem
                                        labelText={
                                            "Bounding Rectangle Vertical Length:"
                                        }
                                        inputProps={{
                                            minValue: 0,
                                            rounded: true,
                                            step: 100,
                                            totalWidth: 150,
                                            type: "up-down",
                                            inputStyle: {
                                                fontSize: 14
                                            },
                                            totalHeight: 50
                                        }}
                                        onChange={setBoundingRectVerticalLength}
                                        helperText={"(in meters)"}
                                        labelStyle={{ fontSize: 16 }}
                                        value={boundingRectVerticalLength}
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
                                <GeoFencingRouter routerNumber={1} />
                                <GeoFencingRouter routerNumber={2} />
                                <GeoFencingRouter routerNumber={3} />
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
