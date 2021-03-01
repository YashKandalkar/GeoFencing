import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, View } from "react-native";
import {
    Button,
    Dialog,
    Paragraph,
    Portal,
    Subheading,
    Surface,
    Title,
    withTheme,
    Modal,
    ActivityIndicator
} from "react-native-paper";
import { setAccessPoints, setSnackbarConfig } from "../redux/mainReduxDuck";
import WifiManager from "react-native-wifi-reborn";
import AccessPoint from "./AccessPoint";
import Divider from "./Divider";

import {
    setAccessPoints as setFirebaseAccessPoints,
    getAccessPoints
} from "../firebase/adminApi";

const AccessPointsList = ({
    setAccessPointsRedux,
    accessPointsRedux,
    setSnackbarConfig,
    containerStyle,
    geofencingData,
    firebaseUser,
    jumpTo,
    theme
}) => {
    const { colors } = theme;
    const { routers } = geofencingData;
    const [deleteLoading, setLoading] = useState(false);
    const [accessPoints, setAccessPoints] = useState(accessPointsRedux ?? []);
    const [nextButtonLoading, setNextButtonLoading] = useState(false);
    const [rescan, setRescan] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [dialog, setDialog] = useState({
        title: null,
        content: null,
        onAction: null
    });

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
        setAccessPoints([
            ...accessPoints,
            {
                routerSignalLevels,
                routersNotFound,
                position: { x: 0, y: 0, z: 0 }
            }
        ]);
        setSnackbarConfig({
            content: "Unsaved Changes! Don't forget to click SAVE!",
            type: "WARNING"
        });
    };

    useEffect(() => {
        getAccessPoints(
            firebaseUser,
            (d) => {
                if (d) {
                    setAccessPoints(Object.values(d));
                    setAccessPointsRedux(Object.values(d));
                }
            },
            console.error
        );
        return () => {};
    }, []);

    const onAPRemove = (ind, onSuccess) => {
        let newArr = accessPoints.filter((_, index) => index !== ind);
        setAccessPointsRedux(newArr);
        setAccessPoints(newArr);
        onSuccess();
    };

    const onRemoveClick = (ind) => {
        setDialog({
            title: "Remove Access Point",
            content: `Are you sure you want to remove this Access Point?`,
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
                jumpTo("doctorTab");
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
                    <Title style={{ color: "#fff" }}>Access Points</Title>
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
                            Click the add button to add Access Points!
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
                        <Divider dividerStyle={{ margin: 16 }} />
                        <View style={styles.formButtonsContainer}>
                            <Button
                                compact
                                style={styles.formButton}
                                mode={"contained"}
                                onPress={onNextClick}
                                disabled={false}
                                loading={nextButtonLoading}
                            >
                                Save and Next
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
                    <Subheading>Adding Access Point</Subheading>
                    <ActivityIndicator />
                </Modal>
            </Portal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        elevation: 2,
        marginHorizontal: 6,
        borderRadius: 8,
        paddingBottom: 16
    },
    topBar: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        paddingVertical: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        marginBottom: 16
    },
    addDoctorsMessage: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 32,
        textAlign: "center"
    },
    formButtonsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    formButton: {
        marginRight: 16
        // marginTop: 8,
        // marginBottom: 8
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
