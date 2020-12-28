import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import { connect } from "react-redux";
import {
    Surface,
    Subheading,
    Headline,
    Divider,
    Button,
    Paragraph
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { DragResizeBlock } from "react-native-drag-resize";

const GeoFencingSetupTab = ({ adminHospitalSetupDone }) => {
    const [image, setImage] = useState(null);
    const [imageBounds, setImageBounds] = useState(null);

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
            quality: 1
        });

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
                            paddingVertical: 8,
                            justifyContent: "center"
                        }}
                    >
                        <Headline style={{ marginLeft: 8 }}>
                            GeoFencing Setup
                        </Headline>
                        <Divider
                            style={{
                                marginHorizontal: 8,
                                marginTop: 4,
                                marginBottom: 16
                            }}
                        />
                        <View
                            style={{
                                borderColor: "#555",
                                borderWidth: 3,
                                padding: 8,
                                margin: 4,
                                justifyContent: "center",
                                alignItems: "center",
                                height: 210
                            }}
                        >
                            {image ? (
                                <View
                                    style={{
                                        flex: 1,
                                        width: "100%",
                                        position: "relative"
                                    }}
                                >
                                    <Image
                                        source={{ uri: image.uri }}
                                        resizeMode="contain"
                                        onLayout={(event) =>
                                            setImageBounds({
                                                ...event.nativeEvent.layout
                                            })
                                        }
                                        style={{
                                            flex: 1,
                                            width: "100%",
                                            height: 50,
                                            maxHeight: 210
                                        }}
                                    />
                                    {imageBounds && (
                                        <DragResizeBlock
                                            x={0}
                                            y={0}
                                            limitation={{
                                                ...imageBounds,
                                                w: imageBounds.width,
                                                h: imageBounds.height
                                            }}
                                        >
                                            <View
                                                style={{
                                                    position: "absolute",
                                                    width: "100%",
                                                    height: "100%",
                                                    backgroundColor:
                                                        "transparent",
                                                    borderColor: "red",
                                                    borderWidth: 4
                                                }}
                                            />
                                        </DragResizeBlock>
                                    )}
                                </View>
                            ) : (
                                <Subheading>
                                    Select the floormap of your hospital!
                                </Subheading>
                            )}
                        </View>
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row",
                                marginVertical: 8
                            }}
                        >
                            {image && (
                                <Button
                                    mode={"outlined"}
                                    onPress={() => setImage(null)}
                                    style={{ marginRight: 8 }}
                                >
                                    Clear
                                </Button>
                            )}
                            <Button mode={"contained"} onPress={pickImage}>
                                Pick an image
                            </Button>
                        </View>
                        <View
                            style={{
                                margin: 8
                            }}
                        >
                            <Headline>Fill in the dimentions:</Headline>
                            <Divider style={{ marginBottom: 8 }} />
                            <Paragraph>
                                These are real world dimentions of the bounding
                                rectangle (Red coloured). All the positions of
                                objects inside the floormap will be relative to
                                this rectangle.
                            </Paragraph>
                            <Paragraph>
                                You can resize the rectangle above but these
                                dimentions will not be affected.
                            </Paragraph>
                        </View>
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

export default connect(mapStateToProps)(GeoFencingSetupTab);
