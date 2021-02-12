import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { connect } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { useDebounce } from "../../utils/hooks";
import {
    setGeofencingData,
    setGeofencingSetupDone,
    setSnackbarConfig
} from "../../redux/mainReduxDuck";

import {
    Button,
    Dialog,
    Headline,
    HelperText,
    Paragraph,
    Portal,
    ProgressBar,
    Subheading,
    Surface
} from "react-native-paper";

import {
    Divider,
    GeoFencingMap,
    GeoFencingRouter,
    NumericFormItem,
    OutlinedContainer,
    Scroll
} from "../../components";

import {
    uploadHospitalMap,
    setGeofencingData as setFirebaseGeofencingData,
    deleteHospitalMap
} from "../../firebase/adminApi";

const GeoFencingSetupTab = ({
    adminHospitalSetupDone,
    setGeofencingSetupDone,
    setGeofencingData,
    setSnackbarConfig,
    geofencingData,
    firebaseUser,
    jumpTo
}) => {
    const [image, setImage] = useState(geofencingData?.image ?? null);
    const [firestoreImageUrl, setFirestoreImageUrl] = useState(null);
    const [imageUploading, setImageUploading] = useState({ value: null });
    const [dialog, setDialog] = useState({
        title: null,
        content: null,
        onAction: null
    });
    const [routers, setRouters] = useState(geofencingData?.routers ?? []);
    const [buttonLoading, setButtonLoading] = useState({
        mapClear: false,
        saveAndNext: false
    });
    const [routerLimits, setRouterLimits] = useState(
        geofencingData?.routerLimits ?? {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        }
    );
    const [actualToPixelFactor, setActualToPixelFactor] = useState(
        geofencingData?.actualToPixelFactor ?? {
            horizontal: 0,
            vertical: 0
        }
    );
    const [geofenceActualDimensions, setGeofenceActualDimensions] = useState(
        geofencingData?.geofenceActualDimensions ?? {
            horizontal: 100,
            vertical: 100
        }
    );
    const [geoFencePixelDimensions, setGeoFencePixelDimensions] = useState(
        geofencingData?.geoFencePixelDimensions ?? {
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
                        geofenceActualDimensions.horizontal +
                    factorOffsets.x,
                vertical:
                    geoFencePixelDimensions.vertical /
                        geofenceActualDimensions.vertical +
                    factorOffsets.y
            };
            setRouters((state) => {
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

    const pickImage = () => {
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1
        }).then((result) => {
            if (!result.cancelled && firebaseUser) {
                console.log(result);
                setImageUploading({ value: 0.0 });
                uploadHospitalMap(
                    firebaseUser,
                    result,
                    (v) => {
                        setImageUploading({ value: v });
                    },
                    (err) => console.error(err),
                    (downloadUrl) => {
                        setFirestoreImageUrl(downloadUrl);
                        setImageUploading({ value: null });
                    }
                )
                    .then(() => setImage(result))
                    .catch(console.error);
            } else {
                setSnackbarConfig({
                    content: "An error occurred! Please try again later...",
                    type: "ERROR"
                });
            }
        });
    };

    const factorOffsets = { x: -0.33, y: -0.33 };

    // when numeric input changes:
    const geoFencePixelDimensionsHandler = useDebounce(500, (dimension) => {
        setGeoFencePixelDimensions({ ...dimension });
        if (
            geofenceActualDimensions.horizontal !== 0 &&
            geofenceActualDimensions.vertical !== 0
        ) {
            setActualToPixelFactor({
                horizontal:
                    dimension.horizontal / geofenceActualDimensions.horizontal +
                    factorOffsets.x,
                vertical:
                    dimension.vertical / geofenceActualDimensions.vertical +
                    factorOffsets.y
            });
        }
    });

    const routerInfoHandler = (val, ind) => {
        let newArr = [...routers];
        newArr[ind] = { ...routers[ind], ...val };
        setRouters(newArr);
    };

    const onClearClick = () => {
        setDialog({
            title: "Confirmation",
            content: "Are you sure you want to delete this map?",
            onAction: clearImage
        });
    };

    const clearImage = () => {
        setButtonLoading({ ...buttonLoading, mapClear: true });
        deleteHospitalMap(
            firebaseUser,
            () => {
                setImage(null);
                setButtonLoading({ ...buttonLoading, mapClear: false });
                setGeofencingData({
                    ...geofencingData,
                    image: null,
                    geoFencePixelDimensions: null,
                    routerLimits: null,
                    actualToPixelFactor: null
                });
                setGeofencingSetupDone(false);
                setImageUploading({ value: null });
                setDialog({ title: null });
            },
            (err) => {
                console.error(err);
                setButtonLoading({ ...buttonLoading, mapClear: false });
                setSnackbarConfig({
                    content: "An error occurred! Please try again later...",
                    type: "ERROR"
                });
            }
        );
    };

    const onRouterAdd = () => {
        let newRouterArr = [...routers];
        newRouterArr.push({
            horizontal: 0,
            vertical: 0,
            height: 0,
            range: 20
        });
        setRouters(newRouterArr);
        setGeofencingData({ ...geofencingData, routers: newRouterArr });
    };

    const onRouterDelete = (ind) => {
        setDialog({
            title: "Delete Router",
            content:
                "Are you sure you want to delete this router? This action cannot be undone!",
            onAction: () => {
                setButtonLoading({ ...buttonLoading, mapClear: true });
                let newRouterArr = [...routers];
                newRouterArr.splice(ind, 1);
                setFirebaseGeofencingData(
                    firebaseUser,
                    { ...geofencingData, routers: newRouterArr },
                    () => {
                        setButtonLoading({ ...buttonLoading, mapClear: false });
                        setSnackbarConfig({
                            content: "Deleted Router " + (ind + 1),
                            type: "INFO"
                        });
                        setRouters(newRouterArr);
                        setGeofencingData({
                            ...geofencingData,
                            routers: newRouterArr
                        });
                        setDialog({ title: null });
                    },
                    () => {
                        setButtonLoading({ ...buttonLoading, mapClear: false });
                        setSnackbarConfig({
                            content:
                                "Error deleting router. Please check your internet connection!",
                            type: "ERROR"
                        });
                    }
                );
            }
        });
    };

    const onNextClick = () => {
        setButtonLoading({ ...buttonLoading, saveAndNext: true });
        const data = {
            image: { ...image, uri: firestoreImageUrl },
            routers,
            routerLimits,
            actualToPixelFactor,
            geoFencePixelDimensions,
            geofenceActualDimensions
        };
        setFirebaseGeofencingData(
            firebaseUser,
            data,
            () => {
                setButtonLoading({ ...buttonLoading, saveAndNext: false });
                setSnackbarConfig({
                    content: "Uploaded data successfully!",
                    type: "SUCCESS"
                });
                setGeofencingData({ ...data, image });
                setGeofencingSetupDone(true);
                jumpTo("doctorTab");
            },
            () => {
                setButtonLoading({ ...buttonLoading, saveAndNext: false });
                setSnackbarConfig({
                    content:
                        "Error uploading data. Please check your internet connection!",
                    type: "ERROR"
                });
            }
        );
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
                                    minHeight: 210,
                                    maxHeight: 220
                                }}
                            >
                                {image ? (
                                    <GeoFencingMap
                                        actualToPixelFactor={
                                            actualToPixelFactor
                                        }
                                        geoFencePixelDimensionsHandler={
                                            geoFencePixelDimensionsHandler
                                        }
                                        image={image}
                                        routerInfoHandler={routerInfoHandler}
                                        routers={routers}
                                        routerLimits={routerLimits}
                                        setRouterLimits={setRouterLimits}
                                    />
                                ) : imageUploading.value !== null ? (
                                    <View
                                        style={{
                                            marginVertical: 90,
                                            width: "70%"
                                        }}
                                    >
                                        <ProgressBar
                                            progress={imageUploading.value}
                                            // color={"#000"}
                                            visible
                                        />
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
                                {!image && (
                                    <HelperText
                                        style={{
                                            marginTop: 8,
                                            textAlign: "center"
                                        }}
                                        visible={!image}
                                        type={"error"}
                                    >
                                        Please upload the floor map of your
                                        hospital first!
                                    </HelperText>
                                )}
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
                                        disabled={!image}
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
                                compact
                                style={styles.formButton}
                                mode={"contained"}
                                onPress={onNextClick}
                                disabled={routers.length < 3 || !image}
                                loading={buttonLoading.saveAndNext}
                            >
                                Save and Next
                            </Button>
                        </View>
                    </Surface>
                )}
            </View>
            <Portal>
                <Dialog
                    visible={dialog.title !== null}
                    onDismiss={() => setDialog({ title: null })}
                >
                    <Dialog.Title>{dialog.title}</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>{dialog.content}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialog({ title: null })}>
                            Cancel
                        </Button>
                        <Button
                            loading={buttonLoading.mapClear}
                            onPress={dialog.onAction}
                        >
                            Delete
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
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
    geofencingData: state.geofencingData,
    firebaseUser: state.firebaseUser
});

const mapDispatchToProps = (dispatch) => {
    return {
        setGeofencingSetupDone: (val) => dispatch(setGeofencingSetupDone(val)),
        setGeofencingData: (val) => dispatch(setGeofencingData(val)),
        setSnackbarConfig: (config) => dispatch(setSnackbarConfig(config))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GeoFencingSetupTab);
