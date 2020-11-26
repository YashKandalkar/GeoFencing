import React from "react";
import { Surface, withTheme } from "react-native-paper";
import { Text, StyleSheet } from "react-native";

const DoctorListItem = ({ theme }) => {
    const { colors } = theme;
    return (
        <Surface style={styles.item}>
            <Text>This is a doctor</Text>
        </Surface>
    );
};

const styles = StyleSheet.create({
    item: {
        margin: 16,
        elevation: 1,
        padding: 8,
    },
});

export default withTheme(DoctorListItem);
