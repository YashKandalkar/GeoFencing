import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, HelperText } from "react-native-paper";
import NumericInput from "react-native-numeric-input";

const NumericFormItem = ({
    value,
    onChange,
    labelText,
    inputProps,
    labelStyle,
    helperText
}) => {
    return (
        <View style={styles.formItem}>
            <View style={{ alignItems: "center" }}>
                <Text style={{ ...styles.labelText, ...labelStyle }}>
                    {labelText}
                </Text>
                {helperText && (
                    <HelperText type={"info"}>{helperText}</HelperText>
                )}
            </View>
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
        fontSize: 18,
        maxWidth: 150
    }
});

export default NumericFormItem;
