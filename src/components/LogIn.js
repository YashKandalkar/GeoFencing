import React, { useState } from "react";
import { connect } from "react-redux";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Animated, { Easing } from "react-native-reanimated";
import {
    Button,
    HelperText,
    Subheading,
    Surface,
    Text,
    TextInput,
    Title,
    TouchableRipple,
    withTheme
} from "react-native-paper";
import { Controller, useForm } from "react-hook-form";

import {
    setAdminData,
    setAdminId,
    setFirebaseUser,
    setLoggedIn,
    setSnackbarConfig
} from "../redux/mainReduxDuck";
import Scroll from "./Scroll";

import OutlinedContainer from "./OutlinedContainer";

import { createNewUser, loginInUser } from "../firebase/authApi";
import { getAdminData, setHospitalData } from "../firebase/adminApi";
import { getHospitalDetails } from "../firebase/doctorApi";

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Login = ({
    navigation,
    loginAs,
    setLoginAs,
    setLoggedIn,
    setSnackbarConfig,
    setFirebaseUser,
    setAdminData
}) => {
    const { control, handleSubmit, errors } = useForm();
    const [loading, setLoading] = useState(false);
    const [helperText, setHelperText] = useState({
        type: null,
        text: null
    });

    const docOpacity = useState(
        new Animated.Value(loginAs === "DOCTOR" ? 1 : 0)
    )[0];
    const adminOpacity = useState(
        new Animated.Value(loginAs === "ADMIN" ? 1 : 0)
    )[0];

    const isAdmin = loginAs === "ADMIN";

    const onLoginAsClick = () => {
        if (isAdmin) {
            setLoginAs("DOCTOR");
            Animated.timing(docOpacity, {
                toValue: 1,
                duration: 200,
                easing: Easing.ease,
                useNativeDriver: true
            }).start();
            Animated.timing(adminOpacity, {
                toValue: 0,
                duration: 200,
                easing: Easing.ease,
                useNativeDriver: true
            }).start();
        } else {
            setLoginAs("ADMIN");
            Animated.timing(docOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
                easing: Easing.ease
            }).start();
            Animated.timing(adminOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
                easing: Easing.ease
            }).start();
        }
    };

    const onLogin = ({ email, password }) => {
        setLoading(true);
        loginInUser(
            email,
            password,
            (user) => {
                setLoading(false);
                if (!user.emailVerified) {
                    setHelperText({
                        type: "info",
                        text:
                            "A verification email has been sent on your email address! Please click on the link provided in the email and sign in again"
                    });
                } else {
                    // if (loginAs === "ADMIN") {
                    //     getAdminData(
                    //         user,
                    //         (data) => {
                    //             if (data) {
                    //                 setAdminData(data);
                    //             }
                    //
                    //             if (!firebaseApp.auth().currentUser) {
                    //                 setSnackbarConfig({
                    //                     content:
                    //                         "Logged in as " + loginAs + "!",
                    //                     type: "SUCCESS"
                    //                 });
                    //                 // setFirebaseUser(user);
                    //                 // setLoggedIn(true);
                    //             }
                    //         },
                    //         (err) => {
                    //             console.error(err);
                    //             setSnackbarConfig({
                    //                 content:
                    //                     "An error occurred. Please check your internet connection!",
                    //                 type: "ERROR"
                    //             });
                    //         }
                    //     );
                    // } else {
                    //     if (!firebaseApp.auth().currentUser) {
                    //         // getHospitalDetails(
                    //         //     user,
                    //         //     (data, adminId) => {
                    //         //         setHospitalData(data);
                    //         //         setAdminId(adminId);
                    //         //         setSnackbarConfig({
                    //         //             content:
                    //         //                 "Logged in as " + loginAs + "!",
                    //         //             type: "SUCCESS"
                    //         //         });
                    //         //         setFirebaseUser(user);
                    //         //         // setLoggedIn(true);
                    //         //     },
                    //         //     (err) => {
                    //         //         console.error(err);
                    //         //         setSnackbarConfig({
                    //         //             content:
                    //         //                 "An error occurred. Please check your internet connection!",
                    //         //             type: "ERROR"
                    //         //         });
                    //         //     }
                    //         // );
                    //     }
                    // }
                }
            },
            (err) => {
                setLoading(false);
                setLoggedIn(false);
                console.error(err);
                setSnackbarConfig({
                    content: "Error logging in!",
                    type: "ERROR"
                });
            },
            loginAs
        );
    };

    const onAdminSignUp = ({ email, password }) => {
        createNewUser(
            email,
            password,
            (user) => {
                if (!user.emailVerified) {
                    setHelperText({
                        type: "info",
                        text:
                            "A verification email has been sent on your email address! Please click on the link provided in the email and sign in again"
                    });
                } else {
                    setLoggedIn(true);
                    setSnackbarConfig({
                        content: "Logged in as " + loginAs + "!",
                        type: "SUCCESS"
                    });
                }
            },
            (err) => {
                setLoggedIn(false);
                console.error(err);
                setSnackbarConfig({
                    content: "Error logging in!",
                    type: "ERROR"
                });
            },
            "ADMIN"
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Scroll
                contentStyles={{ padding: 0, margin: 0, alignItems: "center" }}
            >
                <Animated.Image
                    source={require("../assets/doctor.jpg")}
                    style={{
                        resizeMode: "cover",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        height: "100%",
                        width: "100%",
                        opacity: docOpacity
                    }}
                />
                <Animated.Image
                    source={require("../assets/admin.jpg")}
                    style={{
                        resizeMode: "cover",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        height: "100%",
                        width: "100%",
                        opacity: adminOpacity
                    }}
                />
                <OutlinedContainer
                    containerStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderColor: isAdmin ? "#008834" : "#155cf8",
                        marginBottom: 110,
                        marginTop: 50,
                        padding: 12
                    }}
                >
                    <Title style={styles.title}>
                        {isAdmin ? "Sign in as Admin" : "Sign in as Doctor"}
                    </Title>
                </OutlinedContainer>

                <Surface
                    style={{
                        ...styles.loginComponent,
                        marginBottom: loginAs === "DOCTOR" ? 50 : 0
                    }}
                >
                    <View style={styles.formItem}>
                        <Text style={styles.textFieldHeading}>
                            Email address
                        </Text>
                        <Controller
                            control={control}
                            render={({ onChange, onBlur, value }) => (
                                <TextInput
                                    mode="outlined"
                                    dense
                                    style={{
                                        backgroundColor: "#fff"
                                    }}
                                    placeholder="email@example.com"
                                    name="email"
                                    onBlur={onBlur}
                                    onChangeText={(value) => onChange(value)}
                                    value={value}
                                    textContentType={"emailAddress"}
                                    error={errors.email}
                                />
                            )}
                            name="email"
                            rules={{ required: true, pattern: emailRegex }}
                            defaultValue=""
                        />
                        {Boolean(errors.email) && (
                            <HelperText
                                type="error"
                                visible={Boolean(errors.email)}
                            >
                                {errors.email?.type === "required"
                                    ? "Email is required!"
                                    : "Enter a valid email address"}
                            </HelperText>
                        )}
                    </View>
                    <View style={styles.formItem}>
                        <Text style={styles.textFieldHeading}>Password</Text>
                        <Controller
                            control={control}
                            render={({ onChange, onBlur, value }) => (
                                <TextInput
                                    mode="outlined"
                                    dense
                                    style={{
                                        backgroundColor: "#fff"
                                    }}
                                    placeholder="password"
                                    textContentType="password"
                                    name="password"
                                    secureTextEntry
                                    onBlur={onBlur}
                                    onChangeText={(value) => onChange(value)}
                                    value={value}
                                    error={errors.password}
                                />
                            )}
                            name="password"
                            rules={{
                                required: true,
                                minLength: 6
                            }}
                            defaultValue=""
                        />
                        {Boolean(errors.password) && (
                            <HelperText
                                type="error"
                                visible={Boolean(errors.password)}
                            >
                                {errors.password?.type === "required"
                                    ? "Password is required!"
                                    : "Password should be at least 6 characters"}
                            </HelperText>
                        )}
                    </View>

                    {helperText.text && (
                        <HelperText visible type={helperText.type}>
                            {helperText.text}
                        </HelperText>
                    )}

                    <Button
                        mode="outlined"
                        uppercase={false}
                        style={{ borderRadius: 6, marginTop: 15 }}
                        contentStyle={{ height: 40 }}
                        onPress={onLoginAsClick}
                    >
                        {isAdmin ? "Login as Doctor" : "Login as Admin"}
                    </Button>
                    <Button
                        mode="contained"
                        uppercase={false}
                        loading={loading}
                        style={{ borderRadius: 6, marginTop: 15 }}
                        contentStyle={{ height: 40 }}
                        onPress={handleSubmit(onLogin)}
                    >
                        {"Sign in"}
                    </Button>
                    {loginAs === "ADMIN" && (
                        <Button
                            uppercase={false}
                            style={{
                                borderRadius: 6,
                                marginTop: 10,
                                alignSelf: "flex-end"
                            }}
                            contentStyle={{ height: 40 }}
                            onPress={handleSubmit(onAdminSignUp)}
                        >
                            {"Sign Up instead?"}
                        </Button>
                    )}
                </Surface>
                <TouchableRipple
                    style={{ marginTop: 30, marginBottom: 16, borderRadius: 8 }}
                    onPress={() => console.log("press")}
                    borderless
                >
                    <OutlinedContainer
                        containerStyle={{
                            ...styles.outlinedContainer,
                            borderColor: isAdmin ? "#008834" : "#155cf8"
                        }}
                    >
                        <Subheading style={{ fontFamily: "sans-serif-light" }}>
                            {"Check our guidelines for patients"}
                        </Subheading>
                    </OutlinedContainer>
                </TouchableRipple>
            </Scroll>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    title: {
        fontFamily: "sans-serif-light",
        fontSize: 28
    },
    container: {
        flex: 1
    },
    scrollViewContent: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        minHeight: "100%"
    },
    loginComponent: {
        padding: 16,
        width: "80%",
        maxWidth: 400,
        elevation: 1,
        borderRadius: 6,
        backgroundColor: "rgba(255,255,255,0.9)"
        // marginTop: 20
    },
    textFieldHeading: {
        fontFamily: "sans-serif-light",
        fontSize: 16
    },
    formItem: {
        // marginTop: 10,
        marginBottom: 15
    },
    outlinedContainer: {
        width: "80%",
        maxWidth: 400,
        alignItems: "center",
        borderColor: "#ddd",
        paddingVertical: 16,
        backgroundColor: "rgba(255,255,255,0.9)"
    }
});

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => {
    return {
        setLoggedIn: (loggedIn) => dispatch(setLoggedIn(loggedIn)),
        setSnackbarConfig: (config) => dispatch(setSnackbarConfig(config)),
        setAdminData: (data) => dispatch(setAdminData(data)),
        setFirebaseUser: (user) => dispatch(setFirebaseUser(user))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Login));
