import action_names from "./action_names";

const { 
    SET_LOGIN_AS,
    SET_LOGGED_IN,
    SET_ADMIN_HOSPITAL_SETUP
} = action_names;

export const setLoginAs = (loginAs) => ({
    type: SET_LOGIN_AS,
    loginAs
});

export const setLoggedIn = (loggedIn) => ({
    type: SET_LOGGED_IN,
    loggedIn
});

export const setAdminHospitalSetup = (adminHospitalSetupDone) => ({
    type: SET_ADMIN_HOSPITAL_SETUP,
    adminHospitalSetupDone
});

