import React, { useState, useEffect } from "react";
import { View, ImageBackground, StyleSheet, Linking } from "react-native";
import OutlinedContainer from "./OutlinedContainer";
import {
    Subheading,
    Headline,
    Caption,
    Avatar,
    Portal,
    Modal,
    Title,
    Button
} from "react-native-paper";
import Divider from "./Divider";

const PatientItem = ({ name, mapImage, location, actualToPixelFactor }) => {
    const [mapBounds, setMapBounds] = useState({});
    const [visible, setVisible] = React.useState(false);

    useEffect(() => {
        if (
            location.x < 0 ||
            location.y < 0 ||
            location.x * actualToPixelFactor.horizontal > mapBounds.width + 1 ||
            location.y * actualToPixelFactor.vertical > mapBounds.height + 1
        ) {
            setVisible(true);
        }
        return () => {};
    }, [location.x, location.y]);

    const openDialer = () => {
        let number;
        if (Platform.OS === "ios") {
            number = "telprompt:${091123456789}";
        } else {
            number = "tel:${091123456789}";
        }
        Linking.openURL(number);
    };

    return (
        <>
            <OutlinedContainer
                containerStyle={{
                    margin: 16,
                    padding: 16,
                    paddingTop: 8,
                    borderColor: "#0349d0"
                }}
            >
                <View
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row"
                    }}
                >
                    <Headline style={{ fontSize: 20 }}>{name}</Headline>
                    <Caption>+91 9969778699</Caption>
                </View>
                <Subheading>Location:</Subheading>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly"
                    }}
                >
                    <Subheading>X: {location.x.toFixed(2)}</Subheading>
                    <Subheading>Y: {location.y.toFixed(2)}</Subheading>
                    <Subheading>Floor: 0</Subheading>
                </View>
                <Divider
                    width={"100%"}
                    dividerStyle={{
                        marginBottom: 16,
                        borderBottomColor: "#0349d0"
                    }}
                />
                <View style={{ width: "100%", alignItems: "center" }}>
                    <ImageBackground
                        source={mapImage}
                        onLayout={({ nativeEvent: { layout } }) => {
                            setMapBounds(layout);
                        }}
                        style={{
                            height:
                                mapImage.height >= mapImage.width
                                    ? "100%"
                                    : undefined,
                            aspectRatio: mapImage.width / mapImage.height,
                            width:
                                mapImage.width > mapImage.height
                                    ? "100%"
                                    : undefined,
                            zIndex: -20,
                            borderColor: "red",
                            borderWidth: 4,
                            marginHorizontal: "auto",
                            maxHeight: 210,
                            overflow: "hidden",
                            display: "flex"
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: "#0349d0",
                                borderRadius: 50,
                                position: "absolute",
                                left:
                                    location.x *
                                        actualToPixelFactor.horizontal -
                                    10,
                                top:
                                    location.y * actualToPixelFactor.vertical -
                                    10,
                                width: 20,
                                height: 20
                            }}
                        />
                    </ImageBackground>
                </View>
            </OutlinedContainer>
            <Portal>
                <Modal
                    visible={visible}
                    dismissable={false}
                    onDismiss={() => setVisible(false)}
                    contentContainerStyle={{ borderRadius: 8 }}
                    style={{
                        margin: 32,
                        borderRadius: 8
                    }}
                >
                    <View style={styles.red}>
                        <Avatar.Icon
                            size={120}
                            icon="alert"
                            style={{ backgroundColor: "red" }}
                        />
                    </View>
                    <View style={styles.body}>
                        <Title>GeoFencing Breach!</Title>
                        <Divider width={"50%"} />
                        <View style={{ flexDirection: "row", marginTop: 16 }}>
                            <Subheading style={{ fontWeight: "bold" }}>
                                Name:&nbsp;
                            </Subheading>
                            <Subheading>{name}</Subheading>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 8 }}>
                            <Subheading style={{ fontWeight: "bold" }}>
                                Location:&nbsp;
                            </Subheading>
                            <Subheading>
                                ({location.x.toFixed(2)},{" "}
                                {location.y.toFixed(2)}, {location.z.toFixed(2)}
                                )
                            </Subheading>
                        </View>

                        <Button
                            icon={"phone"}
                            mode={"contained"}
                            style={{
                                marginTop: 24,
                                paddingHorizontal: 16,
                                paddingVertical: 14
                            }}
                            labelStyle={{ fontSize: 16 }}
                            onPress={openDialer}
                        >
                            Call Security
                        </Button>
                    </View>

                    <View
                        style={{
                            backgroundColor: "white",
                            alignItems: "flex-end",
                            paddingBottom: 16,
                            paddingRight: 16
                        }}
                    >
                        <Button
                            color={"#999"}
                            onPress={() => setVisible(false)}
                        >
                            Dismiss
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: "white",
        margin: 32,
        flexDirection: "column"
    },
    red: {
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "30%"
    },
    body: {
        height: "40%",
        backgroundColor: "white",
        alignItems: "center",
        paddingTop: 8
    }
});

export default PatientItem;
