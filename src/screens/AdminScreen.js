import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Surface, Title, Subheading, Caption } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import DoctorList from "../components/DoctorList";
import OutlinedContainer from "../components/OutlinedContainer";

const AdminScreen = ({ navigation }) => {
    return (
        <>
            <View style={{ flex: 1 }}>
                <Surface style={styles.container}>
                    <Title>Hospital Name</Title>
                    <Subheading>Hospital Address</Subheading>
                    <OutlinedContainer containerStyle={styles.hospitalInfo}>
                        <View style={styles.itemStyle}>
                            <Text style={styles.label}>Doctors: 5</Text>
                            <Text style={styles.label}>Patients: 15</Text>
                        </View>
                        <View style={styles.itemStyle}>
                            <Text style={styles.label}>Beds: 20</Text>
                            <Text style={styles.label}>Ventilators: 13</Text>
                        </View>
                    </OutlinedContainer>
                </Surface>
                <DoctorList containerStyle={{ flex: 2 }} />
            </View>
            <StatusBar style="light" />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 8,
        elevation: 1,
        padding: 16,
        flex: 1,
    },
    hospitalInfo: {
        padding: 16,
        marginVertical: 16,
        paddingHorizontal: 34,
        flex: 1,
    },
    itemStyle: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        // color: "#666",
        fontSize: 16,
    },
});

export default AdminScreen;
