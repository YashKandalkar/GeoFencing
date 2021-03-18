import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
    Surface,
    withTheme,
    Button,
    Title,
    Subheading,
    Dialog,
    Paragraph,
    Portal
} from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { setPatientList } from "../redux/mainReduxDuck";
import {
    getDeviceLocation,
    getPatientList,
    stopLocationListener,
    setPatientList as setPatientListFirebase,
    stopSosListener,
    stopStrapDisconnectListener,
    getSos,
    getStrapDisconnect,
    getPulse,
    stopPulseListener,
    getBatteryLevel,
    stopBatteryLevelListener
} from "../firebase/doctorApi";
import PatientItem from "./PatientItem";
import { firebaseApp } from "../firebase/init";

const emergencies = {
    SOS: "SOS",
    STRAP_DISCONNECT: "STRAP_DISCONNECT",
    BREACH: "BREACH"
};

const PatientList = ({
    containerStyle,
    setPatientList,
    geofencingData,
    hospitalData,
    firebaseUser,
    patientList,
    adminId,
    theme
}) => {
    const { colors } = theme;
    const [loading, setLoading] = useState(false);
    const [deviceLocation, setDeviceLocation] = useState({ x: 0, y: 0, z: 0 });
    const [sos, setSos] = useState({});
    const [strapDisconnect, setStrapDisconnect] = useState({});
    const [currModal, setCurrModal] = useState(null);
    const [newEmergency, setNewEmergency] = useState(0);
    const [pulse, setPulse] = useState(0);
    const [batteryLevel, setBatteryLevel] = useState(0);

    const mounted = useRef(false);
    const [dialog, setDialog] = useState({
        title: null,
        content: null,
        onAction: null
    });

    useEffect(() => {
        mounted.current = true;

        if (mounted.current && firebaseApp.auth().currentUser) {
            // getPatientList(
            //     firebaseUser,
            //     adminId,
            //     (data) => {
            //         if (data) {
            //         }
            //         setPatientList(data ? Object.values(data) : []);
            //     },
            //     (err) => {
            //         console.error(err);
            //     }
            // );
            getDeviceLocation(
                firebaseUser,
                "100000",
                (location) => {
                    setDeviceLocation(location);
                },
                (err) => console.error(err)
            );
            getSos(
                firebaseUser,
                "100000",
                (data) => {
                    if (data) {
                        console.log(
                            Math.abs(Date.now() - new Date(data.time).valueOf())
                        );
                        if (
                            Math.abs(
                                Date.now() - new Date(data.time).valueOf()
                            ) < 10000
                        ) {
                            setCurrModal(emergencies.SOS);
                            setNewEmergency((e) => e + 1);
                        }
                        setSos(data);
                    }
                },
                (err) => console.error(err)
            );
            getStrapDisconnect(
                firebaseUser,
                "100000",
                (data) => {
                    if (data) {
                        if (
                            Math.abs(
                                Date.now() - new Date(data.time).valueOf()
                            ) < 10000
                        ) {
                            setCurrModal(emergencies.STRAP_DISCONNECT);
                            setNewEmergency((e) => e + 1);
                        }
                        setStrapDisconnect(data);
                    }
                },
                (err) => console.error(err)
            );
            getPulse(
                firebaseUser,
                "100000",
                (data) => {
                    if (data) {
                        setPulse(data);
                    }
                },
                (err) => console.error(err)
            );
            getBatteryLevel(
                firebaseUser,
                "100000",
                (data) => {
                    if (data) {
                        setBatteryLevel(data);
                    }
                },
                (err) => console.error(err)
            );
        }

        return () => {
            stopLocationListener();
            stopSosListener();
            stopStrapDisconnectListener();
            stopPulseListener();
            stopBatteryLevelListener();
            mounted.current = false;
        };
    }, [firebaseApp.auth().currentUser]);

    const onAddClick = () => {
        // TODO: implement on patient add
    };
    const onPatientRemove = (ind, func) => {
        // TODO: implement on patient remove
    };

    const onRemoveClick = (ind) => {
        setDialog({
            title: "Remove Doctor",
            content: `Are you sure you want to remove ${patientList[ind].name}?`,
            onAction: () => {
                setLoading(true);
                onPatientRemove(ind, () => {
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
                    <Title style={{ color: "#fff" }}>Patient List</Title>
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
                {patientList?.length ? (
                    patientList.map((el, ind) => (
                        <PatientItem
                            key={ind}
                            name={el.name}
                            pulse={pulse}
                            batteryLevel={batteryLevel}
                            securityNumber={hospitalData.phoneNumber}
                            mapImage={geofencingData.image}
                            actualToPixelFactor={
                                geofencingData.actualToPixelFactor
                            }
                            location={deviceLocation}
                            currModal={currModal}
                            sos={sos}
                            strapDisconnect={strapDisconnect}
                            newEmergency={newEmergency}
                        />
                    ))
                ) : (
                    <View style={styles.addDoctorsMessage}>
                        <Subheading
                            style={{ textAlign: "center", marginBottom: 16 }}
                        >
                            Click the add button to add a Patient!
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
    geofencingData: state.geofencingData,
    firebaseUser: state.firebaseUser,
    hospitalData: state.hospitalData,
    patientList: state.patientList,
    adminId: state.adminId
});

const mapDispatchToProps = (dispatch) => ({
    setPatientList: (data) => dispatch(setPatientList(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withTheme(PatientList));
