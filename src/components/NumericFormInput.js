import React from 'react';
import { View, StyleSheet } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { Controller } from "react-hook-form";
import NumericInput from 'react-native-numeric-input';


const NumericFormInput = ({
    labelText,
    control,
    name,
    required,
    inputProps
}) => {
    return (
        <View style={styles.formItem}>
            <Text style={styles.labelText}>{labelText}</Text>
            <Controller
                control={control}
                render={({ onChange, onBlur, value }) => (
                    <View style={{ minWidth: "55%", alignItems: "center", marginVertical: 8 }}>
                        <NumericInput
                            value={Number(value)}
                            onChange={val => onChange(val)}
                            initValue={0}
                            {...inputProps}
                        />
                    </View>
                )}
                name={name}
                rules={{ required }}
                defaultValue={0}
            />
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

export default NumericFormInput;