import React from "react";
import DoctorListItem from "./DoctorListItem";
import { Surface, withTheme, Button, Title } from "react-native-paper";
import { StyleSheet } from "react-native";

const DoctorList = ({ containerStyle, addDoctor, theme, doctors }) => {
    const { colors } = theme;
    return (
        <Surface
            style={{
                ...styles.container,
                ...containerStyle
            }}
        >
            <Surface
                style={{
                    ...styles.topBar,
                    backgroundColor: colors.primary
                }}
            >
                <Title style={{ color: "#fff" }}>Doctor List</Title>
                <Button
                    compact
                    icon={"plus"}
                    mode="contained"
                    color={colors.background}
                    labelStyle={{ color: colors.primary, marginRight: 14 }}
                    onPress={() => addDoctor()}
                >
                    Add
                </Button>
            </Surface>
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
    },
    topBar: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        paddingVertical: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    }
});

export default withTheme(DoctorList);
