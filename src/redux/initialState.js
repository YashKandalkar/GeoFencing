export default {
    loginAs: "ADMIN",
    loggedIn: null,
    adminHospitalSetupDone: false,
    geofencingSetupDone: false,
    hospitalData: {},
    geofencingData: {},
    doctorList: [],
    patientList: [{ name: "Yash Kandalkar" }],
    adminId: null,
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
