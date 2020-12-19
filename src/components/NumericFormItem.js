import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { Controller } from "react-hook-form";
import NumericInput from "react-native-numeric-input";

const NumericFormItem = ({
    labelText,
    control,
    name,
    required,
    inputProps,
    setMaxValue
}) => {
    const inputRef = React.useRef();
    return (
        <View style={styles.formItem}>
            <Text style={styles.labelText}>{labelText}</Text>
            <View
                style={{
                    minWidth: "55%",
                    alignItems: "center",
                    marginVertical: 8
                }}
            >
                <Controller
                    control={control}
                    render={({ onChange, value }) => (
                        <NumericInput
                            value={Number(value)}
                            onChange={(val) => {
                                setMaxValue && setMaxValue(val);
                                return onChange(Number(val));
                            }}
                            initValue={0}
                            {...inputProps}
                        />
                    )}
                    name={name}
                    rules={{ required }}
                    defaultValue={0}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    formItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 8,
        alignItems: "center",
        marginVertical: 4
    },
    labelText: {
        fontSize: 18
    }
});

export default NumericFormItem;
