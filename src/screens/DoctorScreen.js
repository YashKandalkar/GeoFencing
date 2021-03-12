import React from "react";
import { StatusBar } from "expo-status-bar";
import { connect } from "react-redux";
import { View } from "react-native";
import { Surface, Text } from "react-native-paper";
import { HospitalInfo, Scroll } from "../components";
import PatientList from "../components/PatientList";

const DoctorScreen = ({ navigation }) => {
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

export default connect()(DoctorScreen);
