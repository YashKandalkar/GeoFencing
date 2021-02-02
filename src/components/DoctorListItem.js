import React from "react";
import {
    Avatar,
    Caption,
    IconButton,
    Paragraph,
    Subheading,
    Surface,
    withTheme
} from "react-native-paper";
import { StyleSheet, View } from "react-native";

const DoctorListItem = ({ theme, docInfo }) => {
    const { colors } = theme;
    const { name, email, age } = docInfo;
    return (
        <Surface
            style={{
                ...styles.item
            }}
        >
            <Avatar.Image size={86} source={require("../assets/avatar.jpg")} />
            <View style={styles.doctorInfo}>
                <Subheading>{name}</Subheading>
                <Caption style={{ maxWidth: 190 }}>Age: {age}</Caption>
                <Paragraph style={{ maxWidth: 190 }}>Email: {email}</Paragraph>
            </View>
            <IconButton
                icon={"delete"}
                style={{ alignSelf: "flex-start" }}
                size={24}
                color={colors.primaryDark}
            />
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
        flexDirection: "row",
        maxHeight: 150
    },
    doctorInfo: {
        marginLeft: 16,
        maxWidth: 170
    }
});

export default withTheme(DoctorListItem);
