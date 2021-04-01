import React from "react";
import {
    Avatar,
    Caption,
    Paragraph,
    IconButton,
    Subheading
} from "react-native-paper";
import { StyleSheet, View } from "react-native";
import OutlinedContainer from "./OutlinedContainer";

const DoctorListItem = ({ docInfo, ind, onDoctorRemove }) => {
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
                onPress={() => onDoctorRemove(ind)}
            />
        </OutlinedContainer>
    );
};

const styles = StyleSheet.create({
    item: {
        margin: 16,
        marginTop: 0,
        padding: 8,
        borderRadius: 8,
        flexDirection: "row"
    },
    doctorInfo: {
        marginLeft: 16,
        maxWidth: "70%"
    }
});

export default DoctorListItem;
