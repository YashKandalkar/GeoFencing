import React, { useState } from "react";
import {
    Portal,
    Modal,
    Button,
    Title,
    Avatar,
    TextInput,
    Subheading,
    IconButton
} from "react-native-paper";
import { View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Divider from "./Divider";
import NumericInput from "react-native-numeric-input";

const AddDoctor = ({ open, uid, setOpen }) => {
    const [docName, setDocName] = useState("");
    const [address, setAddress] = useState("");
    const [errors, setErrors] = useState({ name: false, address: false });
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [doctorDetails, setDoctorDetails] = useState({
        id: null,
        email: "",
        name: "",
        age: null,
        contact: null,
        address: null,
        password: null,
        dob: null
    });

    const containerStyle = {
        backgroundColor: "white",
        padding: 20,
        margin: 16,
        flex: 1,
        maxHeight: 500,
        paddingHorizontal: 36,
        minWidth: 300,
        alignSelf: "center",
        justifyContent: "center",
        justifyItems: "center",
        alignItems: "center"
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === "ios");
        setDate(currentDate);
    };

    const onAddPress = () => {
        const err = { name: false, address: false };
        if (docName === "") {
            err.name = true;
        }
        if (address === "") {
            err.address = true;
        }

        if (err.name || err.address) {
            setErrors(err);
        } else {
            setOpen(false);
        }
    };

    const onCancelPress = () => {
        setDocName("");
        setAddress("");
        setErrors({ name: false, address: false });
        setOpen(false);
    };

    return (
        <Portal>
            <Modal
                visible={open}
                onDismiss={() => setOpen(false)}
                contentContainerStyle={containerStyle}
                style={{
                    flex: 1
                }}
            >
                <Title>Add Doctor</Title>
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "space-evenly"
                    }}
                >
                    <Avatar.Image
                        size={86}
                        source={require("../assets/avatar.jpg")}
                    />

                    <Divider
                        width={250}
                        dividerStyle={{ marginVertical: 16 }}
                    />

                    <TextInput
                        name="name"
                        type="text"
                        label="Name"
                        placeholder="Name"
                        style={{ width: 250 }}
                        mode={"outlined"}
                        error={errors.name}
                        dense
                    />
                    <TextInput
                        name="address"
                        type="text"
                        label="Address"
                        placeholder="Address"
                        style={{ width: 250 }}
                        mode={"outlined"}
                        error={errors.address}
                        dense
                    />
                    <View
                        style={{ alignItems: "center", flexDirection: "row" }}
                    >
                        <Subheading>Date of Birth: </Subheading>
                        {showDatePicker ? (
                            <DateTimePicker
                                value={date}
                                onChange={onDateChange}
                                display={"default"}
                            />
                        ) : (
                            <>
                                <Subheading>
                                    {date.toLocaleDateString()}
                                </Subheading>
                                <IconButton
                                    icon={"pencil-outline"}
                                    accessibilityLabel="Edit Date of Birth"
                                    onPress={() => {
                                        setShowDatePicker(true);
                                    }}
                                />
                            </>
                        )}
                    </View>

                    <View
                        style={{ alignItems: "center", flexDirection: "row" }}
                    >
                        <Subheading>Unique ID: </Subheading>
                        <Subheading>{uid}</Subheading>
                    </View>
                </View>
                <Divider width={250} dividerStyle={{ marginVertical: 16 }} />
                <View
                    style={{
                        flexDirection: "row",
                        alignSelf: "flex-end"
                    }}
                >
                    <Button onPress={onCancelPress}>Cancel</Button>
                    <Button mode="contained" onPress={onAddPress}>
                        Add
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
};

export default AddDoctor;
