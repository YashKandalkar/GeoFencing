import React from "react";
import { connect } from "react-redux";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Subheading, Surface, Text, Title } from "react-native-paper";
import OutlinedContainer from "./OutlinedContainer";

const HospitalInfo = ({ hospitalData, doctorList }) => {
    return (
        <Surface style={styles.container}>
            <ImageBackground
                source={require("../assets/hospital.webp")}
                style={styles.imageBackground}
                imageStyle={{ borderRadius: 8 }}
            >
                <View style={styles.childContainer}>
                    <Title style={{ color: "#eee" }}>{hospitalData.name}</Title>
                    <Subheading style={{ color: "#eee" }}>
                        {hospitalData.address}
                    </Subheading>
                    <Subheading style={{ color: "#eee" }}>
                        {hospitalData.phoneNumber}
                    </Subheading>

                    <OutlinedContainer containerStyle={styles.hospitalInfo}>
                        <View style={styles.itemStyle}>
                            <Text style={styles.label}>
                                {"Doctors: " +
                                    (doctorList !== null
                                        ? Array.isArray(doctorList)
                                            ? doctorList.length
                                            : Object.values(doctorList).length
                                        : 0)}
                            </Text>
                            <Text style={styles.label}>Patients: 0 </Text>
                        </View>
                        <View style={styles.itemStyle}>
                            <Text style={styles.label}>
                                {"Beds: " + hospitalData.availableBeds}
                            </Text>
                            <Text style={styles.label}>
                                {"Ventilators: " +
                                    hospitalData.availableVentilators}
                            </Text>
                        </View>
                    </OutlinedContainer>
                </View>
            </ImageBackground>
        </Surface>
    );
};

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    childContainer: {
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 16,
        color: "#eee",
        borderRadius: 8
    },
    container: {
        margin: 8,
        elevation: 1,
        borderRadius: 8
    },
    hospitalInfo: {
        padding: 16,
        marginVertical: 16,
        paddingHorizontal: 34,
        flex: 1
    },
    itemStyle: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    label: {
        color: "#eee",
        fontSize: 16
    }
});

const mapStateToProps = (state) => ({
    hospitalData: state.hospitalData,
    doctorList: state.doctorList
});

export default connect(mapStateToProps)(HospitalInfo);
