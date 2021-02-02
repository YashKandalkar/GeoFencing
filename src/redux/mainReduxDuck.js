import initialState from "./initialState";

const SET_LOGIN_AS = "SET_LOGIN_AS";
const SET_LOGGED_IN = "SET_LOGGED_IN";
const SET_ADMIN_HOSPITAL_SETUP_DONE = "SET_ADMIN_HOSPITAL_SETUP_DONE";
const SET_GEOFENCING_SETUP_DONE = "SET_GEOFENCING_SETUP_DONE";
const SET_HOSPITAL_DATA = "SET_HOSPITAL_DATA";
const SET_GEOFENCING_DATA = "SET_GEOFENCING_DATA";
const SET_FIREBASE_USER = "SET_FIREBASE_USER";
const SET_SNACKBAR_CONFIG = "SET_SNACKBAR_CONFIG";
const RESET_STATE = "RESET_STATE";

export const setLoginAs = (loginAs) => ({
    type: SET_LOGIN_AS,
    loginAs
});

export const setLoggedIn = (loggedIn) => ({
    type: SET_LOGGED_IN,
    loggedIn
});

export const setAdminHospitalSetupDone = (adminHospitalSetupDone) => ({
    type: SET_ADMIN_HOSPITAL_SETUP_DONE,
    adminHospitalSetupDone
});

export const setGeofencingSetupDone = (geofencingSetupDone) => ({
    type: SET_GEOFENCING_SETUP_DONE,
    geofencingSetupDone
});

export const setHospitalData = (data) => ({
    type: SET_HOSPITAL_DATA,
    hospitalData: data
});

export const setGeofencingData = (data) => ({
    type: SET_GEOFENCING_DATA,
    geofencingData: data
});

export const setFirebaseUser = (user) => ({
    type: SET_FIREBASE_USER,
    firebaseUser: user
});

export const setSnackbarConfig = (config) => ({
    type: SET_SNACKBAR_CONFIG,
    snackbarConfig: config
});

export const resetState = () => ({
    type: RESET_STATE
});

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_LOGIN_AS:
            return {
                ...state,
                loginAs: action.loginAs
            };

        case SET_LOGGED_IN:
            return {
                ...state,
                loggedIn: action.loggedIn
            };
        case SET_ADMIN_HOSPITAL_SETUP_DONE:
            return {
                ...state,
                adminHospitalSetupDone: action.adminHospitalSetupDone
            };

        case SET_GEOFENCING_SETUP_DONE:
            return {
                ...state,
                geofencingSetupDone: action.geofencingSetupDone
            };

        case SET_HOSPITAL_DATA:
            return {
                ...state,
                hospitalData: action.hospitalData
            };

        case SET_GEOFENCING_DATA:
            return {
                ...state,
                geofencingData: action.geofencingData
            };

        case SET_FIREBASE_USER:
            return {
                ...state,
                firebaseUser: action.firebaseUser
            };

        case SET_SNACKBAR_CONFIG:
            let colors = {};
            switch (action.snackbarConfig.type) {
                case "SUCCESS":
                    colors = {
                        onSurface: "#c0ffb7",
                        surface: "#0d9900",
                        accent: "#0d9900"
                    };
                    break;

                case "ERROR":
                    colors = {
                        onSurface: "#ffc2c2",
                        surface: "#ff0000",
                        accent: "#ff0000"
                    };
                    break;

                case "WARNING":
                    colors = {
                        onSurface: "#ffe1a6",
                        surface: "#997800",
                        accent: "#997800"
                    };
                    break;

                case "INFO":
                    colors = {
                        onSurface: "#2196f3",
                        surface: "#fff",
                        accent: "#fff"
                    };
                    break;

                default:
                    break;
            }
            return {
                ...state,
                snackbarConfig: {
                    ...initialState.snackbarConfig,
                    ...action.snackbarConfig,
                    colors
                }
            };

        case RESET_STATE:
            return initialState;

        default:
            return state;
    }
};
