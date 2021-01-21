import React, { useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { generateUID } from "../../utils/functions";

import {
    Subheading,
    Surface,
    Text,
    Title,
    withTheme
} from "react-native-paper";

import {
    DoctorList,
    OutlinedContainer,
    AddDoctor,
    Scroll
} from "../../components";

const DoctorListTab = ({ navigation, theme, geofencingSetupDone }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [uid, setUid] = useState("");
    console.log(geofencingSetupDone);
    const addDoctor = () => {
        // setDoctorDetails({
        //     id: generateUID({ prefix: "DCT" }),
        //     email: "efef",
        //     name: docName
        // });

        setUid(generateUID({ prefix: "DCT" }));
        setDialogOpen(true);
    };

    return (
        <Scroll>
            <View style={{ flex: 1 }}>
                {!geofencingSetupDone ? (
                    <Surface style={styles.setupWarningContainer}>
                        <Subheading>
                            Please complete the GeoFencing setup first!
                        </Subheading>
                    </Surface>
                ) : (
                    <>
                        <Surface style={styles.container}>
                            <ImageBackground
                                source={require("../../assets/hospital.webp")}
                                style={styles.imageBackground}
                                imageStyle={{ borderRadius: 8 }}
                            >
                                <View style={styles.childContainer}>
                                    <Title style={{ color: "#eee" }}>
                                        Hospital Name
                                    </Title>
                                    <Subheading style={{ color: "#eee" }}>
                                        Hospital Address
                                    </Subheading>

                                    <OutlinedContainer
                                        containerStyle={styles.hospitalInfo}
                                    >
                                        <View style={styles.itemStyle}>
                                            <Text style={styles.label}>
                                                Doctors: 5
                                            </Text>
                                            <Text style={styles.label}>
                                                Patients: 15
                                            </Text>
                                        </View>
                                        <View style={styles.itemStyle}>
                                            <Text style={styles.label}>
                                                Beds: 20
                                            </Text>
                                            <Text style={styles.label}>
                                                Ventilators: 13
                                            </Text>
                                        </View>
                                    </OutlinedContainer>
                                </View>
                            </ImageBackground>
                        </Surface>
                        <DoctorList
                            containerStyle={{ flex: 2, marginVertical: 8 }}
                            addDoctor={addDoctor}
                        />
                        <AddDoctor
                            open={dialogOpen}
                            uid={uid}
                            setOpen={setDialogOpen}
                        />
                    </>
                )}
            </View>
        </Scroll>
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
    },
    setupWarningContainer: {
        flex: 1,
        elevation: 1,
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8
    }
});

const mapStateToProps = (state) => ({
    geofencingSetupDone: state.geofencingSetupDone
});

export default connect(mapStateToProps)(withTheme(DoctorListTab));
