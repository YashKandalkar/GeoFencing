export default {
    loginAs: "ADMIN",
    loggedIn: false,
    adminHospitalSetupDone: false,
    geofencingSetupDone: false,
    hospitalData: {},
    geofencingData: {},
    doctorList: [],
    firebaseUser: null,
    snackbarConfig: {
        type: "INFO",
        content: null,
        duration: 4000,
        actionLabel: "Close",
        colors: {
            onSurface: null,
            surface: null,
            accent: null
        }
    }
};
