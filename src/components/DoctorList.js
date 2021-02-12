import React from "react";
import DoctorListItem from "./DoctorListItem";
import {
    Surface,
    withTheme,
    Button,
    Title,
    Subheading
} from "react-native-paper";
import { StyleSheet, View } from "react-native";

const DoctorList = ({
    containerStyle,
    onAddClick,
    theme,
    doctors,
    onDoctorRemove
}) => {
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
                    onPress={() => onAddClick()}
                >
                    Add
                </Button>
            </Surface>
            {doctors.length ? (
                doctors.map((el, ind) => (
                    <DoctorListItem
                        docInfo={el}
                        key={ind}
                        ind={ind}
                        onDoctorRemove={onDoctorRemove}
                    />
                ))
            ) : (
                <View style={styles.addDoctorsMessage}>
                    <Subheading
                        style={{ textAlign: "center", marginBottom: 16 }}
                    >
                        Click the add button to add doctors to your hospital!
                    </Subheading>
                    <Button
                        compact
                        icon={"plus"}
                        mode="contained"
                        labelStyle={{ marginRight: 14 }}
                        onPress={() => onAddClick()}
                    >
                        Add
                    </Button>
                </View>
            )}
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
    },
    addDoctorsMessage: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 32,
        textAlign: "center"
    }
});

export default withTheme(DoctorList);
