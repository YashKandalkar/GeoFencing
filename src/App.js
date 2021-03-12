import React, { useEffect, useCallback } from "react";
import { PermissionsAndroid, View } from "react-native";
import { connect } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
    withTheme,
    IconButton,
    Snackbar,
    ActivityIndicator
} from "react-native-paper";
import LogInScreen from "./screens/LogInScreen";
import AdminScreen from "./screens/AdminScreen";
import DoctorScreen from "./screens/DoctorScreen";
import {
    resetState,
    setFirebaseUser,
    setLoggedIn,
    setSnackbarConfig,
    setAdminData,
    setHospitalData,
    setAdminId
} from "./redux/mainReduxDuck";
import { firebaseApp } from "./firebase/init";
import { getAdminData } from "./firebase/adminApi";
import { getHospitalDetails } from "./firebase/doctorApi";

const Stack = createStackNavigator();

const logoutButton = (onLogout) => (
    <IconButton
        icon="account-arrow-right"
        color={"#fff"}
        size={24}
        onPress={onLogout}
    />
);

const renderLoading = () => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator animating={true} size={"large"} />
    </View>
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
    setHospitalData,
    setAdminId,
    resetState
}) {
    const { colors } = theme;
    const screenOptions = {
        headerStyle: {
            backgroundColor: colors.primary
        },
        headerTintColor: "#fff"
    };

    const authListenerCallback = useCallback(
        (user) => {
            if (user?.emailVerified) {
                setSnackbarConfig({
                    content: "Fetching data...",
                    type: "INFO"
                });
                if (loginAs === "ADMIN") {
                    console.log("getting admin data");
                    getAdminData(
                        user,
                        (data) => {
                            if (data) {
                                setAdminData(data);
                            }

                            if (user?.emailVerified) {
                                setSnackbarConfig({
                                    content: "Logged in as " + loginAs + "!",
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
                    getHospitalDetails(
                        user,
                        (data, adminId) => {
                            if (adminId) {
                                getAdminData(
                                    { uid: adminId },
                                    (adminData) => {
                                        setAdminId(adminId);
                                        if (adminData) {
                                            setAdminData(adminData);
                                            setSnackbarConfig({
                                                content:
                                                    "Logged in as " +
                                                    loginAs +
                                                    "!",
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
                }
            } else {
                setFirebaseUser(null);
                setLoggedIn(false);
            }
        },
        [loginAs]
    );

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
                } else {
                    alert(
                        "This app requires Location Permission to function properly!"
                    );
                }
            })
            .catch(console.error);

        let unsubAuthListener = firebaseApp
            .auth()
            .onAuthStateChanged(authListenerCallback);
        return () => {
            unsubAuthListener();
        };
    }, [loginAs]);

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
                        component={
                            loggedIn === null ? renderLoading : LogInScreen
                        }
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
        setHospitalData: (data) => dispatch(setHospitalData(data)),
        setAdminId: (id) => dispatch(setAdminId(id)),
        resetState: () => dispatch(resetState())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(App));
