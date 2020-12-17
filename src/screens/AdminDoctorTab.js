import React, { useState } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import {
    Text,
    Surface,
    Title,
    Subheading,
    withTheme,
    Dialog,
    Portal,
    Paragraph,
    Button
} from "react-native-paper";
import DoctorList from "../components/DoctorList";
import OutlinedContainer from "../components/OutlinedContainer";
import { ScrollView } from "react-native-gesture-handler";
import AddDoctor from "../components/AddDoctor";
import { generateUID } from "../utils/functions";

const AdminDoctorTab = ({ navigation, theme }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [uid, setUid] = useState("");

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
        <>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={
                    {
                        // backgroundColor: theme.colors.primaryDark,
                    }
                }
            >
                <Surface style={styles.container}>
                    <ImageBackground
                        source={require("../assets/hospital.webp")}
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
                                    <Text style={styles.label}>Doctors: 5</Text>
                                    <Text style={styles.label}>
                                        Patients: 15
                                    </Text>
                                </View>
                                <View style={styles.itemStyle}>
                                    <Text style={styles.label}>Beds: 20</Text>
                                    <Text style={styles.label}>
                                        Ventilators: 13
                                    </Text>
                                </View>
                            </OutlinedContainer>
                        </View>
                    </ImageBackground>
                </Surface>
                <DoctorList
                    containerStyle={{ flex: 2, marginBottom: 8 }}
                    addDoctor={addDoctor}
                />
            </ScrollView>
            <AddDoctor open={dialogOpen} uid={uid} setOpen={setDialogOpen} />
        </>
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

export default withTheme(AdminDoctorTab);
