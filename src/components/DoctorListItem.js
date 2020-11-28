import React from "react";
import {
    Avatar,
    Caption,
    Paragraph,
    Subheading,
    Surface,
    withTheme
} from "react-native-paper";
import { Text, StyleSheet, View } from "react-native";

const DoctorListItem = ({ theme, docInfo }) => {
    const { colors } = theme;
    const { name, uniqueID, age } = docInfo;
    return (
        <Surface
            style={{
                ...styles.item
                // backgroundColor: colors.primaryLight
            }}
        >
            <Avatar.Image size={86} source={require("../assets/avatar.jpg")} />
            <View style={styles.doctorInfo}>
                <Subheading>{name}</Subheading>
                <Caption>Age: {age}</Caption>
                <Paragraph>Unique ID: {uniqueID}</Paragraph>
            </View>
            {/* */}
        </Surface>
    );
};

const styles = StyleSheet.create({
    item: {
        margin: 16,
        elevation: 1,
        padding: 8,
        borderRadius: 8,
        flex: 1,
        flexDirection: "row"
    },
    doctorInfo: {
        marginLeft: 16
    }
});

export default withTheme(DoctorListItem);
