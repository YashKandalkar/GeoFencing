import React from "react";
import { StatusBar } from "expo-status-bar";
import { connect } from "react-redux";
import { View } from "react-native";
import { Text } from "react-native-paper";

const DoctorScreen = ({ navigation }) => {
    return (
        <>
            <View>
                <Text>Doctor Screen</Text>
            </View>
            <StatusBar style="light" />
        </>
    );
};

export default connect()(DoctorScreen);
