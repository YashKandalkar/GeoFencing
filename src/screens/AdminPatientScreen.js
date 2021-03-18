import React from "react";
import { StatusBar } from "expo-status-bar";
import { connect } from "react-redux";
import { Surface } from "react-native-paper";
import { HospitalInfo, Scroll } from "../components";
import PatientList from "../components/PatientList";

const AdminPatientScreen = ({ navigation }) => {
    return (
        <>
            <Scroll>
                <Surface style={{ flex: 1 }}>
                    <HospitalInfo />
                    <PatientList
                        containerStyle={{ flex: 1, marginVertical: 8 }}
                    />
                </Surface>
            </Scroll>
            <StatusBar style="light" />
        </>
    );
};

export default connect()(AdminPatientScreen);
