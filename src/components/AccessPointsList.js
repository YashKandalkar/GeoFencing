import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { StyleSheet, View } from "react-native";
import WifiManager from "react-native-wifi-reborn";
import {
    FAB,
    Title,
    Modal,
    Button,
    Dialog,
    Portal,
    Surface,
    Paragraph,
    withTheme,
    Subheading,
    ActivityIndicator
} from "react-native-paper";

import { setAccessPoints, setSnackbarConfig } from "../redux/mainReduxDuck";
import AccessPoint from "./AccessPoint";

import {
    setAccessPoints as setFirebaseAccessPoints,
    getAccessPoints,
    stopAccessPointsListener
} from "../firebase/adminApi";
import { firebaseApp } from "../firebase/init";

const AccessPointsList = ({
    setAccessPointsRedux,
    accessPointsRedux,
    setSnackbarConfig,
    containerStyle,
    geofencingData,
    firebaseUser,
    currIndex,
    theme
}) => {
    const { colors } = theme;
    const routers = geofencingData?.routers ?? [];
    const [deleteLoading, setLoading] = useState(false);
    const [accessPoints, setAccessPoints] = useState(accessPointsRedux ?? []);
    const [nextButtonLoading, setNextButtonLoading] = useState(false);
    const [rescan, setRescan] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [showFab, setShowFab] = useState(false);
    const [dialog, setDialog] = useState({
        title: null,
        content: null,
        onAction: null
    });

    const mounted = useRef(false);

    const getNearbySignals = async () => {
        let nearbyRoutersSignals = {};
        let wifiList;
        let routerNames = Array.isArray(routers)
            ? routers.map((el) => el.name)
            : Object.values(routers).map((el) => el.name);

        try {
            setModalVisible(true);
            if (rescan) {
                wifiList = await WifiManager.reScanAndLoadWifiList();
            } else {
                wifiList = await WifiManager.loadWifiList();
                setRescan(true);
            }
            setModalVisible(false);
        } catch (err) {
            console.error(err);
            setModalVisible(false);
            alert(
                "Could not get the signal strengths of nearby routers. Make sure your phone's location service is ON!"
            );
            return;
        }

        for (let wifi of wifiList) {
            if (routerNames.includes(wifi.SSID.trim())) {
                nearbyRoutersSignals[wifi.SSID] = wifi.level;
            }
        }

        let notFound = routerNames.filter(
            (el) => !Number.isInteger(nearbyRoutersSignals[el])
        );

        return {
            routerSignalLevels: nearbyRoutersSignals,
            routersNotFound: notFound
        };
    };

    const onAddClick = async () => {
        let { routerSignalLevels, routersNotFound } = await getNearbySignals();
        setShowFab(true);
        setAccessPoints([
            ...accessPoints,
            {
                routerSignalLevels,
                routersNotFound,
                position: { x: 0, y: 0, z: 0 }
            }
        ]);
        setSnackbarConfig({
            content: "Unsaved Changes! Don't forget to click the Tick icon!",
            type: "WARNING"
        });
    };

    useEffect(() => {
        mounted.current = true;
        if (mounted.current && firebaseApp.auth().currentUser) {
            getAccessPoints(
                firebaseApp.auth().currentUser,
                (d) => {
                    if (d) {
                        let newArr = Object.values(d);

                        newArr.forEach((RP) => {
                            if (RP.routersNotFound) {
                                RP.routersNotFound = Object.values(
                                    RP.routersNotFound
                                ).filter(
                                    (rName) =>
                                        !Object.keys(
                                            RP.routerSignalLevels
                                        ).includes(rName)
                                );
                            }
                        });

                        setAccessPoints(newArr);
                        setAccessPointsRedux(Object.values(d));
                    }
                },
                console.error
            );
        }
        return () => {
            stopAccessPointsListener(firebaseUser);
            mounted.current = false;
        };
    }, [firebaseApp.auth().currentUser]);

    const onAPRemove = (ind, onSuccess) => {
        let newArr = accessPoints.filter((_, index) => index !== ind);
        setAccessPointsRedux(newArr);
        setAccessPoints(newArr);
        onSuccess();
    };

    const onRemoveClick = (ind) => {
        setDialog({
            title: "Remove Reference Point",
            content: `Are you sure you want to remove this Reference Point?`,
            onAction: () => {
                setLoading(true);
                let newArr = accessPoints.filter((_, index) => index !== ind);
                setFirebaseAccessPoints(
                    firebaseUser,
                    newArr,
                    () => {
                        onAPRemove(ind, () => {
                            setLoading(false);
                            setDialog({ title: null });
                            setShowFab(false);
                        });
                    },
                    console.error
                );
            }
        });
    };

    const onAPChange = (ind, val) => {
        let newArr = [...accessPoints];
        newArr[ind] = { ...accessPoints[ind], ...val };
        setAccessPoints(newArr);
    };

    const onNextClick = () => {
        setNextButtonLoading(true);

        setFirebaseAccessPoints(
            firebaseUser,
            accessPoints,
            () => {
                setAccessPointsRedux(accessPoints);
                setNextButtonLoading(false);
                setShowFab(false);
            },
            console.error
        );
    };

    return (
        <>
            <Surface
                style={{
                    ...styles.container,
                    ...containerStyle
                }}
            >
                <Surface
                    style={{
                        ...styles.topBar,
                        backgroundColor: colors.primary
                    }}
                >
                    <Title style={{ color: "#fff" }}>Reference Points</Title>
                    <Button
                        compact
                        icon={"plus"}
                        mode="contained"
                        color={colors.background}
                        labelStyle={{ color: colors.primary, marginRight: 14 }}
                        onPress={() => onAddClick()}
                    >
                        Add
                    </Button>
                </Surface>
                {accessPoints?.length ? (
                    accessPoints.map((el, ind) => (
                        <AccessPoint
                            key={ind}
                            ind={ind}
                            onDelete={onRemoveClick}
                            onChange={onAPChange}
                            routerSignalLevels={el.routerSignalLevels}
                            routersNotFound={el.routersNotFound}
                            position={el.position}
                        />
                    ))
                ) : (
                    <View style={styles.addDoctorsMessage}>
                        <Subheading
                            style={{ textAlign: "center", marginBottom: 16 }}
                        >
                            Click the add button to add Reference Points!
                        </Subheading>
                        <Button
                            compact
                            icon={"plus"}
                            mode="contained"
                            labelStyle={{ marginRight: 14 }}
                            onPress={() => onAddClick()}
                        >
                            Add
                        </Button>
                    </View>
                )}
                {accessPoints.length > 0 && (
                    <>
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
                                icon={"plus"}
                                onPress={() => onAddClick()}
                            >
                                Add RP
                            </Button>
                        </View>
                    </>
                )}
            </Surface>
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
                            loading={deleteLoading}
                            onPress={dialog.onAction}
                        >
                            Delete
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Portal>
                <Modal
                    visible={modalVisible}
                    onDismiss={() => setModalVisible(false)}
                    dismissable={false}
                    contentContainerStyle={{
                        backgroundColor: "white",
                        padding: 16,
                        marginHorizontal: 56,
                        alignItems: "center",
                        justifyContent: "space-around",
                        flexDirection: "row",
                        borderLeftColor: colors.primaryDark,
                        borderLeftWidth: 6
                    }}
                >
                    <Subheading>Adding Reference Point</Subheading>
                    <ActivityIndicator />
                </Modal>
            </Portal>
            <Portal>
                {currIndex === 2 &&
                    (showFab ? (
                        <FAB
                            style={styles.fab}
                            small={false}
                            icon="check"
                            loading={nextButtonLoading}
                            onPress={onNextClick}
                        />
                    ) : (
                        <FAB
                            style={{
                                ...styles.fab,
                                backgroundColor: colors.primary
                            }}
                            small={false}
                            icon="plus"
                            loading={false}
                            onPress={onAddClick}
                        />
                    ))}
            </Portal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        elevation: 2,
        borderRadius: 8,
        paddingBottom: 16,
        marginHorizontal: 6
    },
    topBar: {
        display: "flex",
        padding: 16,
        alignItems: "center",
        marginBottom: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    addDoctorsMessage: {
        flex: 1,
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 32
    },
    formButtonsContainer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    formButton: {
        marginRight: 16
    },
    fab: {
        right: 0,
        margin: 16,
        bottom: 60,
        position: "absolute",
        backgroundColor: "#00ae00"
    }
});

const mapStateToProps = (state) => ({
    accessPointsRedux: state.accessPoints,
    firebaseUser: state.firebaseUser,
    geofencingData: state.geofencingData
});

const mapDispatchToProps = (dispatch) => ({
    setAccessPointsRedux: (arr) => dispatch(setAccessPoints(arr)),
    setSnackbarConfig: (config) => dispatch(setSnackbarConfig(config))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withTheme(AccessPointsList));
