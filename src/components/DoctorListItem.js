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
import OutlinedContainer from "./OutlinedContainer";

const DoctorListItem = ({ theme, docInfo, ind }) => {
    const { colors } = theme;
    const { name, email, age } = docInfo;
    return (
        <OutlinedContainer
            containerStyle={{
                ...styles.item,
                marginTop: ind === 0 ? 16 : 0
            }}
        >
            <Avatar.Image size={86} source={require("../assets/avatar.jpg")} />
            <View style={styles.doctorInfo}>
                <Subheading>{name}</Subheading>
                <Caption style={{}}>Age: {age}</Caption>
                <Paragraph style={{}}>{email}</Paragraph>
            </View>
            <IconButton
                icon={"close"}
                style={{ position: "absolute", right: 0, margin: 0 }}
                size={24}
                // color={colors.error}
            />
        </OutlinedContainer>
    );
};

const styles = StyleSheet.create({
    item: {
        margin: 16,
        marginTop: 0,
        // elevation: 1,
        padding: 8,
        borderRadius: 8,
        // flex: 1,
        flexDirection: "row"
        // maxHeight: 150
    },
    doctorInfo: {
        marginLeft: 16,
        maxWidth: "70%"
    }
});

export default withTheme(DoctorListItem);
