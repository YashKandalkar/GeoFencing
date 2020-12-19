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
    render
}) => {
    return (
        <View style={styles.formItem}>
            <Text style={styles.labelText}>{labelText}</Text>
            <Controller
                control={control}
                render={({ onChange, onBlur, value }) => (
                    <View>
                        {render !== undefined ? (
                            render({ onChange, onBlur, value })
                        ) : (
                            <TextInput
                                mode="outlined"
                                dense
                                style={{
                                    backgroundColor: "#fff",
                                    minWidth: "55%"
                                }}
                                placeholder={placeholder}
                                onBlur={onBlur}
                                onChangeText={(value) => onChange(value)}
                                value={value}
                                textContentType={textContentType || "name"}
                                error={errors[name]}
                                {...inputProps}
                            />
                        )}

                        {Boolean(errors[name]) && (
                            <HelperText type="error">
                                {labelText.substr(0, labelText.length - 1)} is
                                required!
                            </HelperText>
                        )}
                    </View>
                )}
                name={name}
                rules={{ required }}
                defaultValue=""
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

export default FormItem;
