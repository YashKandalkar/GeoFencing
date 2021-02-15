import React, { useState } from "react";
import { IconButton, Button } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import { View } from "react-native";
import WifiManager from "react-native-wifi-reborn";

import OutlinedContainer from "./OutlinedContainer";
import NumericFormItem from "./NumericFormItem";
import PropTypes from "prop-types";

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

const GeoFencingRouter = ({
    routerNumber,
    value,
    onChange,
    maxValue,
    onDelete
}) => {
    const [wifiList, setWifiList] = useState(
        value.name
            ? {
                  [value.name]: {
                      label: value.name,
                      value: value.name,
                      icon: () => {}
                  }
              }
            : {}
    );
    const [selectedWifi, setSelectedWifi] = useState(value.name ?? null);
    const [searchText, setSearchText] = useState("");

    let controller;

    const onDropDownOpen = () => {
        WifiManager.loadWifiList()
            .then((L) => {
                let newObj = { ...wifiList };
                for (let i of L) {
                    newObj[i.SSID] = {
                        label: i.SSID,
                        value: i.SSID,
                        icon: () => {}
                    };
                }
                setWifiList(newObj);
            })
            .catch(console.error);
    };

    const onCustomRouterAdd = () => {
        let item = {
            label: searchText,
            value: searchText,
            icon: () => {}
        };
        setWifiList({ ...wifiList, [searchText]: item });
        controller.addItem(item);
        setSelectedWifi(searchText);
        onChange({ name: searchText });
        controller.close();
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
                <DropDownPicker
                    searchable
                    max={3}
                    items={Object.values(wifiList)}
                    placeholder={"Router Name (SSID)"}
                    controller={(inst) => (controller = inst)}
                    onOpen={onDropDownOpen}
                    defaultValue={selectedWifi}
                    onChangeItem={(item) => {
                        setSelectedWifi(item.value);
                        onChange({ name: item.value });
                    }}
                    onSearch={(text) => setSearchText(text.trim())}
                    searchableError={() => (
                        <Button compact mode="text" onPress={onCustomRouterAdd}>
                            Select
                        </Button>
                    )}
                    containerStyle={{
                        width: "80%",
                        marginTop: 8
                    }}
                />
                <IconButton
                    icon={"delete"}
                    onPress={() => onDelete(routerNumber - 1)}
                />
            </View>
            <NumericFormItem
                labelText={"Horizontal Distance:"}
                inputProps={{ ...inputProps, maxValue: maxValue.horizontal }}
                onChange={(val) => {
                    console.log({ val, value });
                    onChange({ horizontal: val });
                }}
                helperText={"(in meters)"}
                labelStyle={{ fontSize: 16 }}
                value={
                    value.horizontal > 0
                        ? value.horizontal <= maxValue.horizontal
                            ? Math.round(value.horizontal)
                            : maxValue.horizontal
                        : 0
                }
            />
            <NumericFormItem
                labelText={"Vertical Distance:"}
                inputProps={{ ...inputProps, maxValue: maxValue.vertical }}
                onChange={(val) => onChange({ vertical: val })}
                helperText={"(in meters)"}
                labelStyle={{ fontSize: 16 }}
                value={
                    value.vertical > 0
                        ? value.vertical <= maxValue.vertical
                            ? Math.round(value.vertical)
                            : maxValue.vertical
                        : 0
                }
            />
            <NumericFormItem
                labelText={"Height:"}
                inputProps={inputProps}
                onChange={(val) => onChange({ height: val })}
                helperText={"(in meters)"}
                labelStyle={{ fontSize: 16 }}
                value={Math.round(value.height)}
            />
            <NumericFormItem
                labelText={"Range:"}
                inputProps={{ ...inputProps, minValue: 20, step: 5 }}
                onChange={(val) => onChange({ range: val })}
                helperText={"(in meters)"}
                labelStyle={{ fontSize: 16 }}
                value={Math.round(value.range)}
            />
        </OutlinedContainer>
    );
};

GeoFencingRouter.defaultProps = {
    value: {
        horizontal: 0,
        vertical: 0,
        height: 0,
        range: 0
    }
};

GeoFencingRouter.propTypes = {
    routerNumber: PropTypes.number.isRequired,
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    maxValue: PropTypes.object
};

export default GeoFencingRouter;
