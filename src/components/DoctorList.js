import React from "react";
import DoctorListItem from "./DoctorListItem";
import { Surface, withTheme } from "react-native-paper";
import { StyleSheet } from "react-native";

const doctors = [
    {
        name: "Dr. Yash Santosh Kandalkar",
        age: 30,
        uniqueID: 213123
    },
    {
        name: "Dr. Hrushikesh Kandalkar",
        age: 23,
        uniqueID: 412892
    },
    {
        name: "Dr. Manisha Santosh Kandalkar",
        age: 59,
        uniqueID: 532432
    },
    {
        name: "Dr. Sumit Mahajan",
        age: 20,
        uniqueID: 140192
    }
];

const DoctorList = ({ containerStyle, theme }) => {
    const { colors } = theme;
    return (
        <Surface
            style={{
                ...styles.container,
                // backgroundColor: colors.primary,
                ...containerStyle
            }}
        >
            {doctors.map((el) => (
                <DoctorListItem docInfo={el} key={el.uniqueID} />
            ))}
        </Surface>
    );
};

const styles = StyleSheet.create({
    container: {
        elevation: 2,
        marginHorizontal: 6,
        borderRadius: 8
    }
});

export default withTheme(DoctorList);
