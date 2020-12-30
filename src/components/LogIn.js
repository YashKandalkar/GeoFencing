import React from "react";
import { connect } from "react-redux";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { withTheme, HelperText } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";

import { setLoggedIn as setLoggedInAction } from "../utils/actions";
import Scroll from "./Scroll";

import {
    Surface,
    Subheading,
    Text,
    TextInput,
    Title,
    Button
} from "react-native-paper";

import OutlinedContainer from "./OutlinedContainer";

const Login = ({ navigation, loginAs, setLoginAs, setLoggedIn }) => {
    const { control, handleSubmit, errors } = useForm();

    const isAdmin = loginAs === "ADMIN";

    const onLoginAsClick = () => {
        if (isAdmin) {
            setLoginAs("DOCTOR");
        } else {
            setLoginAs("ADMIN");
        }
    };

    const onSubmit = () => {
        // TODO: implement login logic
        setLoggedIn(true);
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
                                    onBlur={onBlur}
                                    onChangeText={(value) => onChange(value)}
                                    value={value}
                                    textContentType={"emailAddress"}
                                    error={errors.email}
                                />
                            )}
                            name="email"
                            rules={{ required: false }}
                            defaultValue=""
                        />
                        {Boolean(errors.password) && (
                            <HelperText
                                type="error"
                                visible={Boolean(errors.email)}
                            >
                                Email is required!
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
                                    secureTextEntry
                                    onBlur={onBlur}
                                    onChangeText={(value) => onChange(value)}
                                    value={value}
                                    error={errors.password}
                                />
                            )}
                            name="password"
                            rules={{ required: false }}
                            defaultValue=""
                        />
                        {Boolean(errors.password) && (
                            <HelperText
                                type="error"
                                visible={Boolean(errors.password)}
                            >
                                Password is required!
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
                        style={{ borderRadius: 6, marginTop: 15 }}
                        contentStyle={{ height: 40 }}
                        onPress={handleSubmit(onSubmit)}
                    >
                        {"Sign in"}
                    </Button>
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
        setLoggedIn: (loggedIn) => dispatch(setLoggedInAction(loggedIn))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Login));
