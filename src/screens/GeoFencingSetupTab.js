import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { connect } from "react-redux";
import {
    Surface,
    Title,
    Subheading,
    Headline,
    Divider,
    Button
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

const GeoFencingSetupTab = ({ adminHospitalSetupDone }) => {
    const [image, setImage] = useState(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                try {
                    const {
                        status
                    } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (status !== "granted") {
                        alert(
                            "Sorry, we need camera roll permissions to make this work!"
                        );
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result);
        }
    };
    return (
        <View style={{ flex: 1 }}>
            {!adminHospitalSetupDone ? (
                <Surface style={styles.setupWarningContainer}>
                    <Subheading>
                        Please complete the hospital setup first!
                    </Subheading>
                </Surface>
            ) : (
                <Surface style={styles.mainContainer}>
                    <Surface
                        style={{
                            // borderLeftColor: "#444",
                            // borderLeftWidth: 8,
                            // backgroundColor: "#eee",
                            paddingVertical: 8,
                            justifyContent: "center"
                            // alignItems: "center"
                        }}
                    >
                        <Headline style={{ marginLeft: 8 }}>
                            GeoFencing Setup
                        </Headline>
                        <Divider
                            style={{
                                borderBottomWidth: 1,
                                marginHorizontal: 8,
                                marginTop: 4
                            }}
                        />
                        <Button onPress={pickImage}>Pick an image!</Button>
                        {image && (
                            <Image
                                source={{ uri: image.uri }}
                                style={{
                                    width: 250,
                                    height: 190
                                    // maxWidth: 250,
                                    // maxHeight: 190
                                }}
                            />
                        )}
                    </Surface>
                </Surface>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    setupWarningContainer: {
        flex: 1,
        elevation: 1,
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8
    },
    mainContainer: {
        elevation: 1,
        flex: 1,
        margin: 8,
        padding: 8
    }
});

const mapStateToProps = (state) => ({
    adminHospitalSetupDone: state.adminHospitalSetupDone
});
const mapDispatchToProps = {};

export default connect(mapStateToProps)(GeoFencingSetupTab);
