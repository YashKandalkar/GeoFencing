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
    setHospitalData,
    setGeofencingSetupDone,
    setGeofencingData,
    setAdminHospitalSetupDone,
    setDoctorList
} from "./redux/mainReduxDuck";
import { firebaseApp } from "./firebase/init";
import { getAdminData } from "./firebase/adminApi";

import WifiManager from "react-native-wifi-reborn";

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
    setAdminHospitalSetupDone,
    setHospitalData,
    setGeofencingSetupDone,
    setGeofencingData,
    setDoctorList,
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
                title: "Location permission is required for WiFi connections",
                message:
                    "This app needs location permission as this is required  " +
                    "to scan for wifi networks.",
                buttonNegative: "DENY",
                buttonPositive: "ALLOW"
            }
        )
            .then((granted) => {
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("got perms");
                    WifiManager.loadWifiList()
                        .then((r) => console.log(r))
                        .catch(console.error);
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
                                if (data.hospitalData) {
                                    setHospitalData(data.hospitalData);
                                    setAdminHospitalSetupDone(true);
                                    if (data.geofencingData) {
                                        setGeofencingData(data.geofencingData);
                                        setGeofencingSetupDone(true);
                                    } else {
                                        data.geofencingData = {}; //so that the next if statement works
                                    }
                                    if (data.hospitalFloorMap) {
                                        setGeofencingData({
                                            ...data.geofencingData,
                                            image: data.hospitalFloorMap
                                        });
                                    }
                                }
                                if (data.doctorList) {
                                    setDoctorList(
                                        Object.values(data.doctorList)
                                    );
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
        setAdminHospitalSetupDone: (value) =>
            dispatch(setAdminHospitalSetupDone(value)),
        setHospitalData: (data) => dispatch(setHospitalData(data)),
        setGeofencingSetupDone: (val) => dispatch(setGeofencingSetupDone(val)),
        setGeofencingData: (val) => dispatch(setGeofencingData(val)),
        setDoctorList: (arr) => dispatch(setDoctorList(arr)),
        resetState: () => dispatch(resetState())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(App));
