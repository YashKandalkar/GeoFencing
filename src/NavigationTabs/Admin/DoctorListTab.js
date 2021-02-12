import React, { useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import {
    Subheading,
    Surface,
    Text,
    Title,
    withTheme
} from "react-native-paper";
import {
    DoctorList,
    OutlinedContainer,
    AddDoctor,
    Scroll
} from "../../components";
import { setDoctorList } from "../../redux/mainReduxDuck";
import {
    deleteDoctor,
    setDoctorList as setFirebaseDoctorList
} from "../../firebase/adminApi";

const DoctorListTab = ({
    geofencingSetupDone,
    doctorList,
    setDoctorList,
    firebaseUser
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const onAddClick = () => {
        setDialogOpen(true);
    };

    const onDoctorAdd = (data) => {
        let newArr = [...doctorList, data];
        setFirebaseDoctorList(
            firebaseUser,
            newArr,
            () => {
                setDoctorList(newArr);
            },
            (err) => console.error(err)
        );
    };

    const onDoctorRemove = (ind) => {
        let newArr = [...doctorList].filter((_, elInd) => elInd !== ind);
        deleteDoctor(
            firebaseUser,
            doctorList[ind].email,
            newArr,
            () => {
                setDoctorList(newArr);
            },
            (err) => console.log(err)
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
                        <Surface style={styles.container}>
                            <ImageBackground
                                source={require("../../assets/hospital.webp")}
                                style={styles.imageBackground}
                                imageStyle={{ borderRadius: 8 }}
                            >
                                <View style={styles.childContainer}>
                                    <Title style={{ color: "#eee" }}>
                                        Hospital Name
                                    </Title>
                                    <Subheading style={{ color: "#eee" }}>
                                        Hospital Address
                                    </Subheading>

                                    <OutlinedContainer
                                        containerStyle={styles.hospitalInfo}
                                    >
                                        <View style={styles.itemStyle}>
                                            <Text style={styles.label}>
                                                Doctors: {}
                                            </Text>
                                            <Text style={styles.label}>
                                                Patients: 15
                                            </Text>
                                        </View>
                                        <View style={styles.itemStyle}>
                                            <Text style={styles.label}>
                                                Beds: 20
                                            </Text>
                                            <Text style={styles.label}>
                                                Ventilators: 13
                                            </Text>
                                        </View>
                                    </OutlinedContainer>
                                </View>
                            </ImageBackground>
                        </Surface>
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
