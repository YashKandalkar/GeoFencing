import React, { useEffect } from "react";
import { PermissionsAndroid } from "react-native";
import { connect } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { withTheme, IconButton, Snackbar } from "react-native-paper";
import LogInScreen from "./screens/LogInScreen";
import AdminScreen from "./screens/AdminScreen";
import DoctorScreen from "./screens/DoctorScreen";
import {
    resetState,
    setFirebaseUser,
    setLoggedIn,
    setSnackbarConfig,
    setAdminData
} from "./redux/mainReduxDuck";
import { firebaseApp } from "./firebase/init";
import { getAdminData } from "./firebase/adminApi";

const Stack = createStackNavigator();

const logoutButton = (onLogout) => (
    <IconButton
        icon="account-arrow-right"
        color={"#fff"}
        size={24}
        onPress={onLogout}
    />
);

function App({
    theme,
    loginAs,
    loggedIn,
    snackbarConfig,
    setLoggedIn,
    setFirebaseUser,
    setSnackbarConfig,
    setAdminData,
    resetState
}) {
    const { colors } = theme;
    const screenOptions = {
        headerStyle: {
            backgroundColor: colors.primary
        },
        headerTintColor: "#fff"
    };

    useEffect(() => {
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title:
                    "Location permission is required for showing WiFi connections",
                message:
                    "This app needs location permission as this is required  " +
                    "to scan for wifi networks.",
                buttonNegative: "DENY",
                buttonPositive: "ALLOW"
            }
        )
            .then((granted) => {
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("got ACCESS_FINE_LOCATION perm");
                } else {
                    console.log("denied perm");
                }
            })
            .catch(console.error);

        let unsubAuthListener = firebaseApp
            .auth()
            .onAuthStateChanged((user) => {
                if (user?.emailVerified) {
                    setSnackbarConfig({
                        content: "Fetching data...",
                        type: "INFO"
                    });
                    if (loginAs === "ADMIN") {
                        getAdminData(
                            user,
                            (data) => {
                                if (data) {
                                    setAdminData(data);
                                }

                                if (user?.emailVerified) {
                                    setSnackbarConfig({
                                        content:
                                            "Logged in as " + loginAs + "!",
                                        type: "SUCCESS"
                                    });
                                    setFirebaseUser(user);
                                    setLoggedIn(true);
                                }
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
                    } else {
                        setSnackbarConfig({
                            content: "Logged in as " + loginAs + "!",
                            type: "SUCCESS"
                        });
                        setFirebaseUser(user);
                        setLoggedIn(true);
                    }
                } else {
                    setFirebaseUser(null);
                    setLoggedIn(false);
                }
            });
        return () => {
            unsubAuthListener();
        };
    }, []);

    const onSignOut = () => {
        firebaseApp
            .auth()
            .signOut()
            .then(() => {
                resetState();
                setSnackbarConfig({
                    content: "Logged out successfully!",
                    type: "SUCCESS"
                });
            })
            .catch((err) => err && console.error);
    };

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {!loggedIn ? (
                    <Stack.Screen
                        name="Login"
                        component={LogInScreen}
                        options={{ ...screenOptions, title: "Geo Fencer" }}
                    />
                ) : loginAs === "ADMIN" ? (
                    <Stack.Screen
                        name="Admin"
                        component={AdminScreen}
                        options={{
                            ...screenOptions,
                            headerRight: () => logoutButton(onSignOut)
                        }}
                    />
                ) : (
                    <Stack.Screen
                        name="Doctor"
                        component={DoctorScreen}
                        options={{
                            ...screenOptions,
                            headerRight: () => logoutButton(onSignOut)
                        }}
                    />
                )}
            </Stack.Navigator>
            {!!snackbarConfig.content && (
                <Snackbar
                    visible={!!snackbarConfig.content}
                    onDismiss={() => setSnackbarConfig({ content: null })}
                    theme={{
                        colors: snackbarConfig.colors
                    }}
                    duration={snackbarConfig.duration}
                    action={{
                        label: snackbarConfig.actionLabel,
                        onPress: () => setSnackbarConfig({ content: null })
                    }}
                    style={{ marginBottom: 28, marginHorizontal: 28 }}
                >
                    {snackbarConfig.content}
                </Snackbar>
            )}
        </NavigationContainer>
    );
}

const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLoggedIn: (loggedIn) => dispatch(setLoggedIn(loggedIn)),
        setFirebaseUser: (user) => dispatch(setFirebaseUser(user)),
        setSnackbarConfig: (config) => dispatch(setSnackbarConfig(config)),
        setAdminData: (data) => dispatch(setAdminData(data)),
        resetState: () => dispatch(resetState())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(App));
