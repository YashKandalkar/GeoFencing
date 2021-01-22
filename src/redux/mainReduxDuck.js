import initialState from "./initialState";

const SET_LOGIN_AS = "SET_LOGIN_AS";
const SET_LOGGED_IN = "SET_LOGGED_IN";
const SET_ADMIN_HOSPITAL_SETUP_DONE = "SET_ADMIN_HOSPITAL_SETUP_DONE";
const SET_GEOFENCING_SETUP_DONE = "SET_GEOFENCING_SETUP_DONE";
const SET_HOSPITAL_DATA = "SET_HOSPITAL_DATA";
const SET_GEOFENCING_DATA = "SET_GEOFENCING_DATA";

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

        default:
            return state;
    }
};
