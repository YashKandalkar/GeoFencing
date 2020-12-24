import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import NumericInput from "react-native-numeric-input";

const NumericFormItem = ({ labelText, inputProps, value, onChange }) => {
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
                <NumericInput
                    value={value}
                    onChange={(val) => onChange(val)}
                    initValue={value !== 0 ? value : 0}
                    {...inputProps}
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
