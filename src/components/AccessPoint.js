import React, { useState } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import {
    Button,
    HelperText,
    IconButton,
    Modal,
    Portal,
    Subheading,
    Title
} from "react-native-paper";
import NumericFormItem from "./NumericFormItem";
import OutlinedContainer from "./OutlinedContainer";
import Divider from "./Divider";
import DropDownPicker from "react-native-dropdown-picker";

const inputProps = {
    minValue: 0,
    rounded: true,
    step: 100,
    totalWidth: 120,
    inputStyle: {
        fontSize: 14
    },
    totalHeight: 40
};

const modalContainerStyle = {
    padding: 16,
    zIndex: 999,
    marginHorizontal: 16,
    justifyContent: "space-between",
    alignItems: "center",
    height: "50%",
    backgroundColor: "white",
    paddingTop: 32,
    borderRadius: 16
};

const AccessPoint = ({
    ind,
    onDelete,
    routersNotFound,
    routerSignalLevels,
    position,
    onChange,
    geofencingData
}) => {
    const [visible, setVisible] = useState(false);
    const [selectedWifi, setSelectedWifi] = useState(null);
    const hideModal = () => setVisible(false);

    let controller;
    let maxValue = {
        horizontal: geofencingData.geofenceActualDimensions.horizontal,
        vertical: geofencingData.geofenceActualDimensions.vertical
    };

    const addRouterSignalRow = () => {
        onChange(ind, {
            routerSignalLevels: {
                ...routerSignalLevels,
                [selectedWifi]: 0
            },
            routersNotFound: routersNotFound.filter((el) => el !== selectedWifi)
        });
        setSelectedWifi(null);
        controller.close();
        hideModal();
    };

    return (
        <OutlinedContainer
            containerStyle={{
                margin: 16,
                marginTop: ind === 0 ? 0 : 16,
                marginBottom: 0,
                paddingTop: 0
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
                <Subheading style={{ fontWeight: "bold", marginLeft: 8 }}>
                    {"Access Point " + (ind + 1)}
                </Subheading>
                <IconButton icon={"delete"} onPress={() => onDelete(ind)} />
            </View>

            <NumericFormItem
                labelText={"Horizontal Distance:"}
                inputProps={{ ...inputProps, maxValue: maxValue.horizontal }}
                onChange={(val) =>
                    onChange(ind, { position: { ...position, x: val } })
                }
                helperText={"(in meters)"}
                labelStyle={{ fontSize: 16, maxWidth: 80 }}
                value={position.x}
            />
            <NumericFormItem
                labelText={"Vertical Distance:"}
                inputProps={{ ...inputProps, maxValue: maxValue.vertical }}
                onChange={(val) =>
                    onChange(ind, { position: { ...position, y: val } })
                }
                helperText={"(in meters)"}
                labelStyle={{ fontSize: 16, maxWidth: 80 }}
                value={position.y}
            />
            <NumericFormItem
                labelText={"Height:"}
                inputProps={inputProps}
                onChange={(val) =>
                    onChange(ind, { position: { ...position, z: val } })
                }
                helperText={"(in meters)"}
                labelStyle={{ fontSize: 16, maxWidth: 70 }}
                value={position.z}
            />
            <Divider />
            {Object.keys(routerSignalLevels).map((el) => (
                <RouterSignalRow
                    name={el}
                    key={el}
                    signal={routerSignalLevels[el]}
                    onChange={(val) =>
                        onChange(ind, {
                            routerSignalLevels: {
                                ...routerSignalLevels,
                                ...val
                            }
                        })
                    }
                />
            ))}
            {routersNotFound.length > 0 && (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent:
                            Object.keys(routerSignalLevels).length >= 3
                                ? "center"
                                : undefined
                    }}
                >
                    {Object.keys(routerSignalLevels).length < 3 && (
                        <HelperText
                            style={{
                                marginVertical: 8,
                                maxWidth: "75%"
                            }}
                            type={"error"}
                        >
                            Could not find the signals of 3 routers at this
                            access point!
                        </HelperText>
                    )}
                    <Button
                        compact
                        uppercase={false}
                        mode={"contained"}
                        style={{ maxWidth: 60 }}
                        onPress={() => setVisible(true)}
                    >
                        Add
                    </Button>
                </View>
            )}
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={hideModal}
                    contentContainerStyle={modalContainerStyle}
                >
                    <View style={{ width: "100%", alignItems: "center" }}>
                        <Title>Add Router Signal</Title>
                        <Divider
                            width={"80%"}
                            dividerStyle={{ marginVertical: 8 }}
                        />
                        <Subheading style={{ marginVertical: 16 }}>
                            Select Router to add:
                        </Subheading>
                        <DropDownPicker
                            searchable
                            max={2}
                            items={routersNotFound.map((el) => ({
                                label: el,
                                value: el,
                                icon: () => {}
                            }))}
                            containerStyle={{
                                width: "80%",
                                height: 50,
                                marginTop: 30
                            }}
                            dropDownStyle={{ elevation: 999 }}
                            placeholder={"Router Name (SSID)"}
                            controller={(inst) => (controller = inst)}
                            defaultValue={selectedWifi}
                            onChangeItem={(item) => {
                                setSelectedWifi(item.value);
                                controller.close();
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            width: "60%",
                            justifyContent: "space-between"
                        }}
                    >
                        <Button mode={"outlined"} onPress={hideModal}>
                            Cancel
                        </Button>
                        <Button mode={"contained"} onPress={addRouterSignalRow}>
                            Add
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </OutlinedContainer>
    );
};

const RouterSignalRow = ({ name, signal, onChange }) => {
    return (
        <NumericFormItem
            labelText={name + ": "}
            inputProps={{
                ...inputProps,
                minValue: -1000,
                maxValue: 0,
                valueType: "integer",
                step: 1
            }}
            onChange={(val) => onChange({ [name]: val })}
            helperText={"(in dB)"}
            labelStyle={{ fontSize: 16, maxWidth: 75 }}
            value={signal}
        />
    );
};

const mapStateToProps = (state) => ({
    geofencingData: state.geofencingData
});

export default connect(mapStateToProps)(AccessPoint);
