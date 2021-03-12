import React from "react";
import { View, ImageBackground } from "react-native";
import OutlinedContainer from "./OutlinedContainer";
import { Subheading, Headline, Caption } from "react-native-paper";
import Divider from "./Divider";

const PatientItem = ({ name, mapImage, location, actualToPixelFactor }) => {
    //TODO: open modal when out of bounds!
    return (
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
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
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
                        // console.log(layout);
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
                                location.x * actualToPixelFactor.horizontal -
                                10,
                            top: location.y * actualToPixelFactor.vertical - 10,
                            width: 20,
                            height: 20
                        }}
                    />
                </ImageBackground>
            </View>
        </OutlinedContainer>
    );
};

export default PatientItem;
