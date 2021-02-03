import React, { useState } from "react";
import { connect } from "react-redux";
import {
    Portal,
    Modal,
    Button,
    Title,
    Avatar,
    Subheading,
    IconButton
} from "react-native-paper";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import Divider from "./Divider";
import FormItem from "./FormItem";
import { addDoctor } from "../firebase/adminApi";

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const AddDoctor = ({ open, setOpen, onDoctorAdd, firebaseUser }) => {
    const [date, setDate] = useState(new Date(2003, 1, 1));
    const [showDatePicker, setShowDatePicker] = useState(false);

    const { control, handleSubmit, errors, reset } = useForm({});

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === "ios");
        setDate(selectedDate || date);
    };

    const onAddPress = (data) => {
        addDoctor(
            firebaseUser,
            data.email,
            data,
            () => {
                onDoctorAdd({
                    name: data.name,
                    age: new Date().getFullYear() - date.getFullYear(),
                    email: data.email
                });
            },
            (e) => console.error(e)
        );
        reset({ email: "", name: "", address: "" });
        setOpen(false);
    };

    const onCancelPress = () => {
        reset({ email: "", name: "", address: "" });
        setOpen(false);
    };

    return (
        <Portal>
            {open && (
                <Modal
                    visible={open}
                    onDismiss={() => {
                        reset({ email: "", name: "", address: "" });
                        setOpen(false);
                    }}
                    contentContainerStyle={containerStyle}
                    style={{
                        flex: 1
                    }}
                >
                    <Title>Add Doctor</Title>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "space-evenly"
                        }}
                    >
                        <Avatar.Image
                            size={86}
                            source={require("../assets/avatar.jpg")}
                            style={{ alignSelf: "center", marginVertical: 8 }}
                        />

                        <Divider
                            width={250}
                            dividerStyle={{ marginVertical: 16 }}
                        />
                        <FormItem
                            labelText={"Name:"}
                            control={control}
                            errors={errors}
                            required
                            name={"name"}
                            inputStyle={{ minWidth: "70%", maxWidth: 190 }}
                            textContentType={"name"}
                            placeholder={"Doctor Name"}
                        />
                        <FormItem
                            labelText={"Address:"}
                            control={control}
                            errors={errors}
                            required
                            name={"address"}
                            inputStyle={{
                                minWidth: "70%",
                                maxWidth: 190,
                                marginLeft: 8,
                                maxHeight: 80
                            }}
                            inputProps={{ numberOfLines: 3, multiline: true }}
                            textContentType={"fullStreetAddress"}
                            placeholder={"Address"}
                        />
                        <FormItem
                            labelText={"Email:"}
                            control={control}
                            errors={errors}
                            required
                            name={"email"}
                            inputStyle={{ minWidth: "70%", maxWidth: 190 }}
                            placeholder={"email@example.com"}
                            textContentType={"emailAddress"}
                            otherRules={{ pattern: emailRegex }}
                        />
                        <View
                            style={{
                                alignItems: "center",
                                flexDirection: "row",
                                alignSelf: "center"
                            }}
                        >
                            <Subheading>Date of Birth: </Subheading>
                            {showDatePicker ? (
                                <DateTimePicker
                                    value={date}
                                    onChange={onDateChange}
                                    display={"default"}
                                    maximumDate={new Date().setFullYear(
                                        new Date().getFullYear() - 18
                                    )}
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
                    </View>
                    <Divider
                        width={250}
                        dividerStyle={{ marginVertical: 16 }}
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            alignSelf: "flex-end"
                        }}
                    >
                        <Button onPress={onCancelPress}>Cancel</Button>
                        <Button
                            mode="contained"
                            onPress={handleSubmit(onAddPress)}
                        >
                            Add
                        </Button>
                    </View>
                </Modal>
            )}
        </Portal>
    );
};

const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    margin: 16,
    flex: 1,
    maxHeight: 500,
    paddingHorizontal: 18,
    minWidth: 300,
    // maxWidth: 350,
    alignSelf: "center",
    justifyContent: "center",
    justifyItems: "center",
    alignItems: "center"
};

const mapStateToProps = (state) => ({
    firebaseUser: state.firebaseUser
});

export default connect(mapStateToProps)(AddDoctor);
