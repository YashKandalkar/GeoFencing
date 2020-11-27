import React from "react";
import DoctorListItem from "./DoctorListItem";
import { Surface, withTheme } from "react-native-paper";
import { StyleSheet } from "react-native";

const DoctorList = ({ containerStyle, theme }) => {
    const { colors } = theme;
    return (
        <Surface
            style={{
                ...styles.container,
                // backgroundColor: colors.primary,
                ...containerStyle,
            }}
        >
            <DoctorListItem />
            <DoctorListItem />
            <DoctorListItem />
            <DoctorListItem />
            <DoctorListItem />
            <DoctorListItem />
            <DoctorListItem />
            <DoctorListItem />
            <DoctorListItem />
            <DoctorListItem />
            <DoctorListItem />
            <DoctorListItem />
        </Surface>
    );
};

const styles = StyleSheet.create({
    container: {
        elevation: 2,
        marginHorizontal: 6,
        borderRadius: 8,
    },
});

export default withTheme(DoctorList);
