import React, { useState } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import { IconButton, Subheading } from "react-native-paper";
import NumericFormItem from "./NumericFormItem";
import OutlinedContainer from "./OutlinedContainer";

const inputProps = {
    minValue: 0,
    rounded: true,
    step: 100,
    totalWidth: 150,
    type: "up-down",
    inputStyle: {
        fontSize: 14
    },
    totalHeight: 50
};

const AccessPoint = ({
    ind,
    onDelete,
    routerNotFound,
    nearbyRouters,
    geofencingData
}) => {
    const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
    let maxValue = {
        horizontal: geofencingData.geofenceActualDimensions.horizontal,
        vertical: geofencingData.geofenceActualDimensions.vertical
    };
    return (
        <OutlinedContainer containerStyle={{ marginTop: 16, paddingTop: 0 }}>
            <View
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row"
                }}
            >
                <Subheading>{"Access Point " + (ind + 1)}</Subheading>
                <IconButton icon={"delete"} onPress={() => onDelete(ind)} />
            </View>
            {/*
             * TODO: add RouterSignalRow component
             */}

            <NumericFormItem
                labelText={"Horizontal Distance:"}
                inputProps={{ ...inputProps, maxValue: maxValue.horizontal }}
                onChange={(val) => setPosition({ ...position, x: val })}
                helperText={"(in meters)"}
                labelStyle={{ fontSize: 16 }}
                value={position.x}
            />
            <NumericFormItem
                labelText={"Vertical Distance:"}
                inputProps={{ ...inputProps, maxValue: maxValue.vertical }}
                onChange={(val) => setPosition({ ...position, y: val })}
                helperText={"(in meters)"}
                labelStyle={{ fontSize: 16 }}
                value={position.y}
            />
            <NumericFormItem
                labelText={"Height:"}
                inputProps={inputProps}
                onChange={(val) => setPosition({ ...position, z: val })}
                helperText={"(in meters)"}
                labelStyle={{ fontSize: 16 }}
                value={position.z}
            />
        </OutlinedContainer>
    );
};

const mapStateToProps = (state) => ({
    geofencingData: state.geofencingData
});

export default connect(mapStateToProps)(AccessPoint);
