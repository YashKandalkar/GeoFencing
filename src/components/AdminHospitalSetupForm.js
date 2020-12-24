import React, { useState } from "react";
import { Button, Divider, Surface, TextInput, Title } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import FormItem from "./FormItem";
import NumericFormItem from "./NumericFormItem";
import { useForm } from "react-hook-form";
import indianStates from "../utils/IndianStateNames";

const AdminHospitalSetupForm = ({ onSubmit }) => {
    const [beds, setBeds] = useState({ total: 0, available: 0 });
    const [ventilators, setVentilators] = useState({ total: 0, available: 0 });
    const [selectedState, setSelectedState] = useState(null);
    let statePickerController;

    const { control, handleSubmit, errors, reset } = useForm({
        defaultValues: {
            address: "",
            bedsAvailable: 0,
            name: "",
            phoneNumber: "",
            state: null,
            totalBeds: 0,
            totalVentilators: 0,
            ventilatorsAvailable: 0
        }
    });

    const items = Object.keys(indianStates).map((el) => ({
        label: indianStates[el],
        value: el
    }));

    const onReset = () => {
        setBeds({ total: 0, available: 0 });
        setVentilators({ total: 0, available: 0 });
        statePickerController.reset();
        reset({
            address: "",
            bedsAvailable: 0,
            name: "",
            phoneNumber: "",
            state: null,
            totalBeds: 0,
            totalVentilators: 0,
            ventilatorsAvailable: 0
        });
    };

    return (
        <>
            <View style={styles.hospitalInformationForm}>
                <Divider />
                <Title
                    style={{
                        textAlign: "center",
                        fontSize: 24,
                        marginVertical: 16
                    }}
                >
                    Hospital Information:
                </Title>
                <FormItem
                    labelText={"Name:"}
                    control={control}
                    errors={errors}
                    required={true}
                    name={"name"}
                    placeholder={"Hospital Name"}
                />
                <FormItem
                    labelText={"Address:"}
                    control={control}
                    errors={errors}
                    required={true}
                    name={"address"}
                    placeholder={"Address"}
                    textContentType={"fullStreetAddress"}
                    inputProps={{
                        multiline: true,
                        numberOfLines: 3,
                        alignContent: "center"
                    }}
                />
                <FormItem
                    labelText={"State:"}
                    control={control}
                    errors={errors}
                    required={true}
                    name={"state"}
                    placeholder={"State"}
                    render={({ onChange, onBlur, value }) => (
                        <DropDownPicker
                            searchable
                            items={items}
                            placeholder={"Select a state"}
                            controller={(instance) =>
                                (statePickerController = instance)
                            }
                            onChangeItem={(val) => {
                                setSelectedState(val);
                                onChange(val);
                            }}
                            style={{
                                backgroundColor: "#fff",
                                minWidth: "57%",
                                height: 75
                            }}
                            defaultValue={
                                selectedState ? selectedState.value : null
                            }
                            searchablePlaceholder={"Search for a state"}
                            dropDownMaxHeight={300}
                        />
                    )}
                />
                <FormItem
                    labelText={"Phone Number:"}
                    control={control}
                    errors={errors}
                    required={true}
                    name={"phoneNumber"}
                    placeholder={"Phone Number"}
                    textContentType={"telephoneNumber"}
                    inputProps={{
                        left: <TextInput.Icon name="phone" />,
                        keyboardType: "numeric"
                    }}
                />
                <NumericFormItem
                    labelText={"Total Beds:"}
                    control={control}
                    required={true}
                    name={"totalBeds"}
                    inputProps={{ minValue: 0, rounded: true }}
                    setMaxValue={(val) =>
                        setBeds({
                            total: val,
                            available: beds.available
                        })
                    }
                />
                <NumericFormItem
                    labelText={"Beds Available:"}
                    control={control}
                    required={true}
                    name={"bedsAvailable"}
                    inputProps={{
                        minValue: 0,
                        rounded: true,
                        maxValue: beds.total
                    }}
                />
                <NumericFormItem
                    labelText={"Total Ventilators:"}
                    control={control}
                    required={true}
                    name={"totalVentilators"}
                    inputProps={{ minValue: 0, rounded: true }}
                    setMaxValue={(val) =>
                        setVentilators({
                            total: val,
                            available: ventilators.available
                        })
                    }
                />
                <NumericFormItem
                    labelText={"Ventilators Available:"}
                    control={control}
                    required={true}
                    name={"ventilatorsAvailable"}
                    inputProps={{
                        minValue: 0,
                        rounded: true,
                        maxValue: ventilators.total
                    }}
                />
            </View>
            <View style={styles.formButtonsContainer}>
                <Button
                    style={styles.formButton}
                    mode={"outlined"}
                    onPress={onReset}
                >
                    Reset
                </Button>
                <Button
                    style={styles.formButton}
                    mode={"contained"}
                    onPress={handleSubmit(onSubmit)}
                >
                    Next
                </Button>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    hospitalInformationForm: {
        flex: 3,
        marginTop: 8,
        padding: 8
    },
    formButtonsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    formButton: {
        marginRight: 16,
        marginBottom: 16
    }
});

export default AdminHospitalSetupForm;
