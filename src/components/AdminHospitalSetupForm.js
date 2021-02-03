import React, { useState } from "react";
import { Button, Divider, TextInput, Title } from "react-native-paper";
import { View, StyleSheet, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import FormItem from "./FormItem";
import NumericFormItem from "./NumericFormItem";
import { useForm } from "react-hook-form";
import indianStates from "../utils/IndianStateNames";
import { connect } from "react-redux";
import {
    setAdminHospitalSetupDone,
    setHospitalData,
    setSnackbarConfig
} from "../redux/mainReduxDuck";
import { deleteHospitalData } from "../firebase/adminApi";

const AdminHospitalSetupForm = ({
    onSubmit,
    firebaseUser,
    hospitalData,
    setHospitalData,
    setSnackbarConfig,
    setAdminHospitalSetup
}) => {
    const {
        totalBeds,
        availableBeds,
        totalVentilators,
        availableVentilators
    } = hospitalData;
    const [buttonLoading, setButtonLoading] = useState({
        save: false,
        clear: false
    });
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
        setButtonLoading({ ...buttonLoading, save: true });
        onSubmit(
            {
                ...data,
                totalBeds: beds.total,
                availableBeds: beds.available,
                totalVentilators: ventilators.total,
                availableVentilators: ventilators.available,
                state: selectedState
            },
            () => setButtonLoading({ ...buttonLoading, save: false })
        );
    };

    const items = Object.keys(indianStates).map((el) => ({
        label: indianStates[el],
        value: el
    }));

    const onReset = () => {
        setButtonLoading({ ...buttonLoading, clear: true });
        deleteHospitalData(
            firebaseUser,
            () => {
                setBeds({ total: 0, available: 0 });
                setVentilators({ total: 0, available: 0 });
                statePickerController.reset();
                setAdminHospitalSetup(false);
                setHospitalData({});
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
                setSnackbarConfig({
                    content: "Reset data successful!",
                    type: "SUCCESS"
                });
                setButtonLoading({ ...buttonLoading, clear: false });
            },
            (err) => {
                console.error(err);
                setSnackbarConfig({
                    content:
                        "Error resetting data. Please check your internet connection!",
                    type: "ERROR"
                });
                setButtonLoading({ ...buttonLoading, clear: false });
            }
        );
    };

    const onResetClick = () => {
        Alert.alert(
            "Delete Hospital Info?",
            "This action is not reversible!",
            [
                {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel"
                },
                { text: "OK", onPress: onReset }
            ],
            { cancelable: true }
        );
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
                    inputProps={{ minValue: 0, rounded: true, maxValue: 10000 }}
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
                    inputProps={{ minValue: 0, rounded: true, maxValue: 10000 }}
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
                    compact
                    style={styles.formButton}
                    mode={"outlined"}
                    onPress={onResetClick}
                    loading={buttonLoading.clear}
                >
                    Reset
                </Button>
                <Button
                    compact
                    style={styles.formButton}
                    mode={"contained"}
                    onPress={handleSubmit(onSubmitFunction)}
                    loading={buttonLoading.save}
                >
                    Save and Next
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
    hospitalData: state.hospitalData,
    firebaseUser: state.firebaseUser
});

const mapDispatchToProps = (dispatch) => {
    return {
        setAdminHospitalSetup: (value) =>
            dispatch(setAdminHospitalSetupDone(value)),
        setHospitalData: (data) => dispatch(setHospitalData(data)),
        setSnackbarConfig: (config) => dispatch(setSnackbarConfig(config))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminHospitalSetupForm);
