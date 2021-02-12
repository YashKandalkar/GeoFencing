import React, { useState } from "react";
import { connect } from "react-redux";
import { SafeAreaView, StyleSheet, View } from "react-native";
import {
    Button,
    HelperText,
    Snackbar,
    Subheading,
    Surface,
    Text,
    TextInput,
    Title,
    withTheme
} from "react-native-paper";
import { Controller, useForm } from "react-hook-form";

import {
    setAdminData,
    setFirebaseUser,
    setLoggedIn,
    setSnackbarConfig
} from "../redux/mainReduxDuck";
import Scroll from "./Scroll";

import OutlinedContainer from "./OutlinedContainer";

import { createNewUser, loginInUser } from "../firebase/authApi";
import { getAdminData } from "../firebase/adminApi";

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

    const isAdmin = loginAs === "ADMIN";

    const onLoginAsClick = () => {
        if (isAdmin) {
            setLoginAs("DOCTOR");
        } else {
            setLoginAs("ADMIN");
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
                    if (loginAs === "ADMIN") {
                        getAdminData(
                            user,
                            (data) => {
                                if (data) {
                                    setAdminData(data);
                                }

                                setSnackbarConfig({
                                    content: "Logged in as " + loginAs + "!",
                                    type: "SUCCESS"
                                });
                                setFirebaseUser(user);
                                setLoggedIn(true);
                            },
                            (err) => {
                                console.error(err);
                                setSnackbarConfig({
                                    content:
                                        "An error occurred. Please check your internet connection!",
                                    type: "ERROR"
                                });
                            }
                        );
                    }
                }
            },
            (err) => {
                setLoading(false);
                setLoggedIn(false);
                console.log(err);
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
            <Scroll contentStyles={{ alignItems: "center" }}>
                <Title style={styles.title}>
                    {isAdmin ? "Sign in as Admin" : "Sign in as Doctor"}
                </Title>
                <Surface style={styles.loginComponent}>
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

                    <Subheading
                        style={{
                            textAlign: "right",
                            fontSize: 14,
                            color: "#0366d6",
                            fontFamily: "sans-serif-medium"
                        }}
                    >
                        {"Forgot password?"}
                    </Subheading>

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
                <OutlinedContainer containerStyle={styles.outlinedContainer}>
                    <Subheading style={{ fontFamily: "sans-serif-light" }}>
                        {"Check our guidelines for patients"}
                    </Subheading>
                </OutlinedContainer>
            </Scroll>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    title: {
        marginBottom: 48,
        fontFamily: "sans-serif-light",
        fontSize: 30
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
        borderRadius: 6
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
        marginTop: 75,
        marginBottom: 16,
        alignItems: "center",
        borderColor: "#ddd",
        paddingVertical: 16
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
