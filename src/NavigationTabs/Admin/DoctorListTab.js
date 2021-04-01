import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { Button, Subheading, Surface, withTheme } from "react-native-paper";
import { AddDoctor, DoctorList, HospitalInfo, Scroll } from "../../components";
import { setDoctorList } from "../../redux/mainReduxDuck";
import {
    deleteDoctor,
    setDoctorList as setFirebaseDoctorList
} from "../../firebase/adminApi";

const DoctorListTab = ({
    route,
    doctorList,
    firebaseUser,
    setDoctorList,
    geofencingSetupDone
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const onAddClick = () => {
        setDialogOpen(true);
    };

    const onDoctorAdd = (data) => {
        let newArr = [
            ...(Array.isArray(doctorList)
                ? doctorList
                : Object.values(doctorList ?? {})),
            data
        ];
        setFirebaseDoctorList(
            firebaseUser,
            newArr,
            () => {
                setDoctorList(newArr);
            },
            (err) => console.error(err)
        );
    };

    const onDoctorRemove = (ind, onEnd) => {
        let newArr = [...doctorList].filter((_, elInd) => elInd !== ind);
        deleteDoctor(
            firebaseUser,
            doctorList[ind].email,
            newArr,
            () => {
                setDoctorList(newArr);
                onEnd();
            },
            (err) => {
                console.log(err);
                onEnd();
            }
        );
    };

    return (
        <Scroll>
            <View style={{ flex: 1 }}>
                {!geofencingSetupDone ? (
                    <Surface style={styles.setupWarningContainer}>
                        <Subheading>
                            Please complete the GeoFencing setup first!
                        </Subheading>
                    </Surface>
                ) : (
                    <>
                        <HospitalInfo />
                        <View
                            style={{ alignItems: "center", marginVertical: 8 }}
                        >
                            <Button
                                mode={"contained"}
                                onPress={() =>
                                    route.navigation.navigate(
                                        "AdminPatientScreen"
                                    )
                                }
                            >
                                Open Patient Screen
                            </Button>
                        </View>
                        <DoctorList
                            containerStyle={{ flex: 1, marginVertical: 8 }}
                            onDoctorRemove={onDoctorRemove}
                            onAddClick={onAddClick}
                            doctors={doctorList}
                        />
                        <AddDoctor
                            open={dialogOpen}
                            setOpen={setDialogOpen}
                            onDoctorAdd={onDoctorAdd}
                        />
                    </>
                )}
            </View>
        </Scroll>
    );
};

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    childContainer: {
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 16,
        color: "#eee",
        borderRadius: 8
    },
    container: {
        margin: 8,
        elevation: 1,
        borderRadius: 8
    },
    hospitalInfo: {
        padding: 16,
        marginVertical: 16,
        paddingHorizontal: 34,
        flex: 1
    },
    itemStyle: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    label: {
        color: "#eee",
        fontSize: 16
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
    geofencingSetupDone: state.geofencingSetupDone,
    doctorList: state.doctorList,
    firebaseUser: state.firebaseUser
});

const mapDispatchToProps = (dispatch) => ({
    setDoctorList: (arr) => dispatch(setDoctorList(arr))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withTheme(DoctorListTab));
