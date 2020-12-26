import React, { useState } from "react";
import { Button, Divider, TextInput, Title } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import FormItem from "./FormItem";
import NumericFormItem from "./NumericFormItem";
import { useForm } from "react-hook-form";
import indianStates from "../utils/IndianStateNames";
import { connect } from "react-redux";

const AdminHospitalSetupForm = ({ onSubmit, hospitalData }) => {
    const {
        totalBeds,
        availableBeds,
        totalVentilators,
        availableVentilators
    } = hospitalData;

    const [beds, setBeds] = useState({
        total: totalBeds || 0,
        available: availableBeds || 0
    });
    const [ventilators, setVentilators] = useState({
        total: totalVentilators || 0,
        available: availableVentilators || 0
    });
    const [selectedState, setSelectedState] = useState(
        hospitalData.state || null
    );
    let statePickerController;

    const { control, handleSubmit, errors, reset } = useForm({
        defaultValues: hospitalData.address
            ? { ...hospitalData }
            : {
                  address: "",
                  availableBeds: 0,
                  name: "",
                  phoneNumber: "",
                  state: null,
                  totalBeds: 0,
                  totalVentilators: 0,
                  availableVentilators: 0
              }
    });

    const onSubmitFunction = (data) => {
        onSubmit({
            ...data,
            totalBeds: beds.total,
            availableBeds: beds.available,
            totalVentilators: ventilators.total,
            availableVentilators: ventilators.available,
            state: selectedState
        });
    };

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
                    render={({ onChange }) => (
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
                    inputProps={{ minValue: 0, rounded: true }}
                    value={beds.total}
                    onChange={(val) => {
                        if (val < beds.available) {
                            setBeds({ total: val, available: val });
                        } else {
                            setBeds({ ...beds, total: val });
                        }
                    }}
                />
                <NumericFormItem
                    labelText={"Beds Available:"}
                    inputProps={{
                        minValue: 0,
                        rounded: true,
                        maxValue: beds.total
                    }}
                    value={beds.available}
                    onChange={(val) => {
                        setBeds({ ...beds, available: val });
                    }}
                />
                <NumericFormItem
                    labelText={"Total Ventilators:"}
                    inputProps={{ minValue: 0, rounded: true }}
                    value={ventilators.total}
                    onChange={(val) => {
                        if (val < ventilators.available) {
                            setVentilators({ total: val, available: val });
                        } else {
                            setVentilators({ ...ventilators, total: val });
                        }
                    }}
                />
                <NumericFormItem
                    labelText={"Ventilators Available:"}
                    inputProps={{
                        minValue: 0,
                        rounded: true,
                        maxValue: ventilators.total
                    }}
                    value={ventilators.available}
                    onChange={(val) => {
                        setVentilators({ ...ventilators, available: val });
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
                    onPress={handleSubmit(onSubmitFunction)}
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

const mapStateToProps = (state) => ({
    hospitalData: state.hospitalData
});

export default connect(mapStateToProps)(AdminHospitalSetupForm);
