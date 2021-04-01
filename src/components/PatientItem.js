import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
    View,
    ImageBackground,
    StyleSheet,
    Linking,
    Vibration,
    AppState
} from "react-native";
import Sound from "react-native-sound";
import {
    Subheading,
    Headline,
    Caption,
    Avatar,
    Portal,
    Modal,
    Title,
    Button
} from "react-native-paper";

import Divider from "./Divider";
import OutlinedContainer from "./OutlinedContainer";

Sound.setCategory("Playback");

const PatientItem = ({
    sos,
    name,
    pulse,
    mapImage,
    location,
    currModal,
    batteryLevel,
    newEmergency,
    geofencingData,
    securityNumber,
    strapDisconnect
}) => {
    const [visible, setVisible] = React.useState(false);
    const [alertSound, setAlertSound] = useState(null);
    const [breach, setBreach] = useState(false);
    const appState = useRef(AppState.currentState);
    const [actualToPF, setActualToPF] = useState({
        horizontal: 0,
        vertical: 0
    });

    const onStateChange = (nextState) => {
        if (
            appState.current.match(/inactive|background/) &&
            nextState === "active"
        ) {
            if (visible) {
                alertSound.play();
                Vibration.vibrate([500, 1000], true);
            }
        } else {
            alertSound && alertSound.stop();
            Vibration.cancel();
        }

        appState.current = nextState;
    };

    useEffect(() => {
        AppState.addEventListener("change", onStateChange);

        return () => {
            AppState.removeEventListener("change", onStateChange);
        };
    }, [alertSound]);

    useEffect(() => {
        if (currModal) {
            setVisible(true);
        }
        return () => {};
    }, [newEmergency]);

    useEffect(() => {
        let geofenceW =
            (geofencingData?.geofence?.width /
                geofencingData.actualToPixelFactor.horizontal) *
            actualToPF.horizontal;
        let geofenceH =
            (geofencingData?.geofence?.height /
                geofencingData.actualToPixelFactor.vertical) *
            actualToPF.vertical;
        let geofenceX =
            ((geofencingData?.geofence?.x - geofencingData.routerLimits.x) /
                geofencingData.actualToPixelFactor.horizontal) *
            actualToPF.horizontal;

        let geofenceY =
            ((geofencingData?.geofence?.y - geofencingData.routerLimits.y) /
                geofencingData.actualToPixelFactor.vertical) *
            actualToPF.vertical;
        if (
            location.x * actualToPF.horizontal < geofenceX - 1 ||
            location.y * actualToPF.vertical < geofenceY - 1 ||
            location.x * actualToPF.horizontal > geofenceW + 1 ||
            location.y * actualToPF.vertical > geofenceH + 1
        ) {
            setVisible(true);
            setBreach(true);
            let aS = new Sound("alert.mp3", Sound.MAIN_BUNDLE, (error) => {
                if (error) {
                    console.error("failed to load the sound", error);
                } else {
                    aS.play();
                }
            });
            aS.setNumberOfLoops(-1);
            setAlertSound(aS);
            Vibration.vibrate([500, 1000], true);
        } else {
            setVisible(false);
            alertSound && alertSound.stop();
            Vibration.cancel();
            setBreach(false);
        }
        return () => {
            alertSound && alertSound.stop();
            alertSound && alertSound.release();
            setVisible(false);
            Vibration.cancel();
            setBreach(false);
        };
    }, [location.x, location.y]);

    const openDialer = () => {
        let number;
        if (Platform.OS === "ios") {
            number = "telprompt:${" + securityNumber + "}";
        } else {
            number = "tel:${" + securityNumber + "}";
        }
        Linking.openURL(number);
    };

    const onDismiss = () => {
        setVisible(false);
        setBreach(false);
        alertSound && alertSound.stop();
        Vibration.cancel();
    };

    let batteryIcon;
    if (batteryLevel >= 80) {
        batteryIcon = "battery";
    } else if (batteryLevel >= 50) {
        batteryIcon = "battery-60";
    } else if (batteryLevel >= 20) {
        batteryIcon = "battery-20";
    } else {
        batteryIcon = "battery-alert";
    }

    return (
        <>
            <OutlinedContainer
                containerStyle={{
                    margin: 16,
                    padding: 16,
                    paddingTop: 8,
                    borderColor: "#0349d0"
                }}
            >
                <View
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row"
                    }}
                >
                    <Headline style={{ fontSize: 20, fontWeight: "bold" }}>
                        {name}
                    </Headline>
                    <Caption>{securityNumber}</Caption>
                </View>
                <Subheading style={{ fontWeight: "bold" }}>
                    Location:
                </Subheading>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly"
                    }}
                >
                    <Subheading>X: {location.x.toFixed(2)}</Subheading>
                    <Subheading>Y: {location.y.toFixed(2)}</Subheading>
                    <Subheading>Floor: 0</Subheading>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginVertical: 8
                    }}
                >
                    <View style={{ flexDirection: "row" }}>
                        <Subheading style={{ fontWeight: "bold" }}>
                            Pulse:&nbsp;
                        </Subheading>
                        <Subheading>{pulse + " bpm"}</Subheading>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    >
                        <Subheading style={{ fontWeight: "bold" }}>
                            Battery:&nbsp;
                        </Subheading>
                        <Subheading>{batteryLevel.toFixed(0) + "%"}</Subheading>
                        <Avatar.Icon
                            icon={batteryIcon}
                            style={{ backgroundColor: "#fff" }}
                            color={
                                batteryIcon === "battery"
                                    ? "#00B232"
                                    : batteryIcon === "battery-alert"
                                    ? "#BC0000"
                                    : undefined
                            }
                            size={38}
                        />
                    </View>
                </View>
                <Divider
                    width={"100%"}
                    dividerStyle={{
                        marginBottom: 16,
                        borderBottomColor: "#0349d0"
                    }}
                />
                <View style={{ width: "100%", alignItems: "center" }}>
                    {mapImage && (
                        <ImageBackground
                            source={mapImage}
                            onLayout={({ nativeEvent: { layout } }) => {
                                console.log(layout);
                                setActualToPF({
                                    horizontal:
                                        layout.width /
                                        geofencingData.geofenceActualDimensions
                                            .horizontal,
                                    vertical:
                                        layout.height /
                                        geofencingData.geofenceActualDimensions
                                            .vertical
                                });
                            }}
                            style={{
                                height:
                                    mapImage.height >= mapImage.width
                                        ? "100%"
                                        : undefined,
                                aspectRatio: mapImage.width / mapImage.height,
                                width:
                                    mapImage.width > mapImage.height
                                        ? "100%"
                                        : undefined,
                                zIndex: -20,
                                borderColor: "red",
                                borderWidth: 4,
                                marginHorizontal: "auto",
                                maxHeight: 210,
                                overflow: "hidden",
                                display: "flex"
                            }}
                        >
                            <View
                                style={{
                                    position: "absolute",
                                    left:
                                        ((geofencingData?.geofence?.x -
                                            geofencingData.routerLimits.x) /
                                            geofencingData.actualToPixelFactor
                                                .horizontal) *
                                        actualToPF.horizontal,
                                    top:
                                        ((geofencingData?.geofence?.y -
                                            geofencingData.routerLimits.y) /
                                            geofencingData.actualToPixelFactor
                                                .vertical) *
                                        actualToPF.vertical,
                                    width:
                                        (geofencingData?.geofence?.width /
                                            geofencingData.actualToPixelFactor
                                                .horizontal) *
                                            actualToPF.horizontal ?? "100%",
                                    height:
                                        (geofencingData?.geofence?.height /
                                            geofencingData.actualToPixelFactor
                                                .vertical) *
                                            actualToPF.vertical ?? "100%",
                                    borderWidth: 4,
                                    borderColor: "purple",
                                    backgroundColor: "rgba(114,0,221, 0.3)"
                                }}
                            />
                            <View
                                style={{
                                    backgroundColor: "#0349d0",
                                    borderRadius: 50,
                                    position: "absolute",
                                    left:
                                        location.x * actualToPF.horizontal - 10,
                                    top: location.y * actualToPF.vertical - 10,
                                    width: 20,
                                    height: 20
                                }}
                            />
                        </ImageBackground>
                    )}
                </View>
            </OutlinedContainer>
            <Portal>
                <Modal
                    visible={visible}
                    dismissable={false}
                    onDismiss={() => setVisible(false)}
                    contentContainerStyle={{ borderRadius: 8 }}
                    style={{
                        margin: 32,
                        borderRadius: 8
                    }}
                >
                    <View style={styles.red}>
                        <Avatar.Icon
                            size={120}
                            icon="alert"
                            style={{ backgroundColor: "red" }}
                        />
                    </View>
                    <View style={styles.body}>
                        <Title style={{ fontSize: 24 }}>
                            {breach
                                ? "GeoFencing Breach!"
                                : currModal === "SOS"
                                ? "SOS!"
                                : "Strap Disconnected!"}
                        </Title>
                        <Divider width={"50%"} />
                        <View style={{ flexDirection: "row", marginTop: 16 }}>
                            <Subheading style={{ fontWeight: "bold" }}>
                                Name:&nbsp;
                            </Subheading>
                            <Subheading>{name}</Subheading>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 16 }}>
                            <Subheading style={{ fontWeight: "bold" }}>
                                Device ID:&nbsp;
                            </Subheading>
                            <Subheading>{"100000"}</Subheading>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 8 }}>
                            <Subheading style={{ fontWeight: "bold" }}>
                                Location:&nbsp;
                            </Subheading>
                            <Subheading>
                                ({location.x.toFixed(2)},{" "}
                                {location.y.toFixed(2)}, 0.5)
                            </Subheading>
                        </View>

                        {(currModal === "SOS" ||
                            currModal === "STRAP_DISCONNECT") && (
                            <>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        marginTop: 8
                                    }}
                                >
                                    <Subheading style={{ fontWeight: "bold" }}>
                                        Time:&nbsp;
                                    </Subheading>
                                    <Subheading>
                                        {new Date(
                                            currModal === "SOS"
                                                ? sos.time
                                                : strapDisconnect.time
                                        ).toLocaleTimeString()}
                                        {", "}
                                        {new Date(
                                            currModal === "SOS"
                                                ? sos.time
                                                : strapDisconnect.time
                                        ).toLocaleDateString()}
                                    </Subheading>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginTop: 8
                                    }}
                                >
                                    {currModal === "SOS" ? (
                                        <Subheading
                                            style={{ fontWeight: "bold" }}
                                        >
                                            Last SOS Time:&nbsp;
                                        </Subheading>
                                    ) : (
                                        <Subheading
                                            style={{ fontWeight: "bold" }}
                                        >
                                            Last Strap {"\n"}
                                            Disconnect Time:&nbsp;
                                        </Subheading>
                                    )}
                                    <Subheading>
                                        {new Date(
                                            currModal === "SOS"
                                                ? sos.prevTime
                                                : strapDisconnect.prevTime
                                        ).toLocaleTimeString()}
                                        {", "}
                                        {new Date(
                                            currModal === "SOS"
                                                ? sos.prevTime
                                                : strapDisconnect.prevTime
                                        ).toLocaleDateString()}
                                    </Subheading>
                                </View>
                            </>
                        )}

                        <Button
                            icon={"phone"}
                            mode={"contained"}
                            style={{
                                marginVertical: 24
                            }}
                            labelStyle={{ fontSize: 16 }}
                            onPress={openDialer}
                        >
                            Call Security
                        </Button>
                    </View>

                    <View
                        style={{
                            backgroundColor: "white",
                            alignItems: "flex-end",
                            paddingBottom: 16,
                            paddingRight: 16
                        }}
                    >
                        <Button color={"#999"} onPress={onDismiss}>
                            Dismiss
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: "white",
        margin: 32,
        flexDirection: "column"
    },
    red: {
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "30%"
    },
    body: {
        backgroundColor: "white",
        alignItems: "center",
        paddingTop: 8
    }
});
const mapStateToProps = (state) => ({
    geofencingData: state.geofencingData
});

export default connect(mapStateToProps)(PatientItem);
