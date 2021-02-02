import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, HelperText } from "react-native-paper";
import { Controller } from "react-hook-form";

const FormItem = ({
    labelText,
    control,
    errors,
    name,
    required,
    placeholder,
    inputProps,
    textContentType,
    render,
    inputStyle = {},
    otherRules = {}
}) => {
    return (
        <View style={styles.formItem}>
            <Text style={styles.labelText}>{labelText}</Text>
            <View>
                <Controller
                    control={control}
                    name={name}
                    rules={{ required, ...otherRules }}
                    defaultValue=""
                    render={({ onChange, onBlur, value }) =>
                        render !== undefined ? (
                            render({ onChange, onBlur, value })
                        ) : (
                            <TextInput
                                mode="outlined"
                                dense
                                style={{
                                    backgroundColor: "#fff",
                                    minWidth: "55%",
                                    ...inputStyle
                                }}
                                placeholder={placeholder}
                                onBlur={onBlur}
                                onChangeText={(value) => onChange(value)}
                                value={value}
                                textContentType={textContentType || "name"}
                                error={Boolean(errors[name])}
                                {...inputProps}
                            />
                        )
                    }
                />
                {Boolean(errors[name]?.type) && (
                    <HelperText type="error">
                        {errors[name]?.type === "required"
                            ? labelText.substr(0, labelText.length - 1) +
                              "is required!"
                            : "Email is not valid!"}
                    </HelperText>
                )}
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

export default FormItem;
