export default {
    loginAs: "ADMIN",
    loggedIn: null,
    adminHospitalSetupDone: false,
    geofencingSetupDone: false,
    hospitalData: {},
    geofencingData: {},
    doctorList: [],
    accessPoints: [],
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
