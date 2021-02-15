import React, { useState } from "react";
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
    withTheme
} from "react-native-paper";
import DoctorListItem from "./DoctorListItem";
import { setAccessPoints } from "../redux/mainReduxDuck";
import WifiManager from "react-native-wifi-reborn";
import AccessPoint from "./AccessPoint";

const AccessPointsList = ({
    setAccessPoints,
    containerStyle,
    accessPoints,
    routers,
    theme
}) => {
    const { colors } = theme;
    const [loading, setLoading] = useState(false);
    const [nearbyRouters, setNearbyRouters] = useState({
        foundSignals: {},
        notFound: []
    });
    const [dialog, setDialog] = useState({
        title: null,
        content: null,
        onAction: null
    });

    const onAddClick = () => {
        let nearbyRoutersSignals = {};

        let routerNames = Array.isArray(routers)
            ? routers.map((el) => el.name)
            : Object.values(routers).map((el) => el.name);

        WifiManager.loadWifiList()
            .then((wifiList) => {
                for (let wifi of wifiList) {
                    if (routerNames.includes(wifi.SSID)) {
                        nearbyRoutersSignals[wifi.SSID] = wifi.level;
                    }
                }
            })
            .catch((err) => {
                console.error(err);
                alert(
                    "Could not get the signal strengths of nearby routers. Make sure your phone's location service is ON!"
                );
            });

        setNearbyRouters({
            foundSignals: nearbyRoutersSignals,
            notFound: routerNames.filter(
                (el) => !Number.isInteger(nearbyRoutersSignals[el])
            )
        });

        setAccessPoints([...accessPoints, { routerSignalLevels: {} }]);
    };

    const onAPRemove = (ind, onSuccess) => {};

    const onRemoveClick = (ind) => {
        setDialog({
            title: "Remove Access Point",
            content: `Are you sure you want to remove this Access Point?`,
            onAction: () => {
                setLoading(true);
                onAPRemove(ind, () => {
                    setLoading(false);
                    setDialog({ title: null });
                });
            }
        });
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
                            routerNotFound={nearbyRouters.notFound}
                            nearbyRouters={nearbyRouters.foundSignals}
                        />
                    ))
                ) : (
                    <View style={styles.addDoctorsMessage}>
                        <Subheading
                            style={{ textAlign: "center", marginBottom: 16 }}
                        >
                            Click the add button to add doctors to your
                            hospital!
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
                        <Button loading={loading} onPress={dialog.onAction}>
                            Delete
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        elevation: 2,
        marginHorizontal: 6,
        borderRadius: 8
    },
    topBar: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        paddingVertical: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    addDoctorsMessage: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 32,
        textAlign: "center"
    }
});

const mapStateToProps = (state) => ({
    accessPoints: state.accessPoints,
    routers: state.routers
});

const mapDispatchToProps = (dispatch) => ({
    setAccessPoints: (arr) => dispatch(setAccessPoints(arr))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withTheme(AccessPointsList));
