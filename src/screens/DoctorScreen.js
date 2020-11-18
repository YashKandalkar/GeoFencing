import React from 'react';
import { connect } from "react-redux";
import { View } from "react-native";
import { Text } from "react-native-paper";

const DoctorScreen = ({ navigation }) => {
    return (
        <View>
            <Text>
                Doctor Screen
            </Text>
        </View>
    )
}

export default connect()(DoctorScreen);