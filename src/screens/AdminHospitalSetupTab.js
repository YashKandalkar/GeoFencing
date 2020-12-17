import React, { useState, useEffect } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import {
    Surface,
    Text,
    Banner,
    Title,
    Paragraph,
    Button,
    TextInput,
    Headline,
    Divider
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";

import Scroll from "../components/Scroll";

const AdminHospitalSetupTab = () => {
    const [bannerVisible, setBannerVisible] = useState(true);
    const { control, handleSubmit, errors } = useForm();

    // useEffect(() => {
    //     const timer = setTimeout(() => setBannerVisible(true), 5000);
    //     return () => {
    //         clearTimeout(timer);
    //     };
    // }, []);

    return (
        <>
            <Banner
                style={{
                    margin: 8,
                    alignItems: "space-between",
                    justifyContent: "space-between"
                }}
                visible={bannerVisible}
                actions={[
                    {
                        label: "Got It",
                        onPress: () => setBannerVisible(false)
                    }
                ]}
                contentStyle={styles.bannerContent}
                icon={"information"}
            >
                <View>
                    <Title>Welcome to GeoFencer!</Title>
                    <Paragraph style={{ maxWidth: 280 }}>
                        Please fill out the hospital information and GeoFencing
                        details in the following section.
                    </Paragraph>
                </View>
            </Banner>
            <Scroll>
                <Surface style={styles.container}>
                    <View
                        style={{
                            alignItems: "center",
                            flex: 1,
                            alignContent: "center",
                            justifyContent: "center"
                        }}
                    >
                        <ImageBackground
                            source={require("../assets/hospital.webp")}
                            style={styles.imageBackground}
                            imageStyle={{ borderRadius: 8 }}
                        >
                            <View style={styles.childContainer}>
                                <Headline style={styles.title}>
                                    Hospital Cover
                                </Headline>
                                <Button
                                    mode={"contained"}
                                    color={"#eee"}
                                    compact
                                    uppercase={false}
                                    style={{ marginTop: 8 }}
                                >
                                    Click to Edit
                                </Button>
                            </View>
                        </ImageBackground>
                    </View>
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
                        />
                        <FormItem
                            labelText={"Phone Number:"}
                            control={control}
                            errors={errors}
                            required={true}
                            name={"phoneNumber"}
                            placeholder={"Phone Number"}
                            inputProps={{
                                left: <TextInput.Icon name="phone" />
                            }}
                        />
                        <FormItem
                            labelText={"Beds Available:"}
                            control={control}
                            errors={errors}
                            required={true}
                            name={"bedsAvailable"}
                            placeholder={"Beds Available"}
                            inputProps={
                                {
                                    // left: <TextInput.Icon name="phone" />
                                }
                            }
                        />
                    </View>
                </Surface>
            </Scroll>
        </>
    );
};

const FormItem = ({
    labelText,
    control,
    errors,
    name,
    required,
    placeholder,
    inputProps,
    textContentType
}) => {
    return (
        <View style={styles.formItem}>
            <Text style={styles.labelText}>{labelText}</Text>
            <Controller
                control={control}
                render={({ onChange, onBlur, value }) => (
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
                        error={errors.email}
                        {...inputProps}
                    />
                )}
                name={name}
                rules={{ required }}
                defaultValue=""
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        elevation: 2,
        // height: 1000,
        borderRadius: 8
    },
    bannerContent: {
        backgroundColor: "rgba(255,229,100,0.3);",
        borderColor: "#ffe564",
        borderLeftWidth: 8,
        paddingVertical: 0,
        alignItems: "center",
        justifyContent: "space-between"
    },
    imageBackground: {
        flex: 1,
        width: "100%",
        resizeMode: "cover"
    },
    childContainer: {
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 16,
        borderRadius: 8,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        color: "#eee",
        fontSize: 28
    },
    hospitalInformationForm: {
        flex: 4,
        marginTop: 8,
        padding: 8
    },
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

export default AdminHospitalSetupTab;
