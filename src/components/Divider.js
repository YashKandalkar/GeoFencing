import React from "react";
import { View, StyleSheet } from "react-native";

const Divider = ({ width, dividerStyle }) => {
    const styles = {
        width,
        borderBottomColor: "#A2A2A2",
        borderBottomWidth: StyleSheet.hairlineWidth
    };
    return <View style={{ ...styles, ...dividerStyle }} />;
};

export default Divider;
