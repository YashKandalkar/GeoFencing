import { firebaseApp } from "./init";

export const getHospitalDetails = (user, onSuccess, onError) => {
    firebaseApp
        .database()
        .ref("users/" + user.uid + "/adminId")
        .once("value")
        .then((snap) => {
            const adminId = snap.val();
            firebaseApp
                .database()
                .ref("users/" + adminId + "/hospitalData")
                .once("value", (snap) => {
                    onSuccess(snap.val(), adminId);
                })
                .catch(onError);
        })
        .catch(onError);
};

export const setPatientList = (user, adminId, data, onSuccess, onError) => {
    firebaseApp
        .database()
        .ref("users/" + adminId + "/patientList")
        .set(data)
        .then(onSuccess)
        .catch(onError);
};

export const addPatient = (user, adminId, data, onSuccess, onError) => {
    firebaseApp
        .database()
        .ref("users/" + adminId + "/patientList")
        .push(data)
        .then(onSuccess)
        .catch(onError);
};

export const getPatientList = (user, adminId, onSuccess, onError) => {
    firebaseApp
        .database()
        .ref("users/" + adminId + "/patientList")
        .once("value", (snap) => {
            onSuccess(snap.val());
        })
        .catch((err) => onError(err));
};

export const getDeviceLocation = (user, deviceId, onSuccess, onError) => {
    firebaseApp
        .database()
        .ref("devices/" + "100000" + "/location")
        .on(
            "value",
            (snap) => {
                onSuccess(snap.val());
            },
            onError
        );
};

export const stopLocationListener = () => {
    firebaseApp
        .database()
        .ref("devices/" + "100000" + "/location")
        .off();
};

export const getSos = (user, deviceId, onSuccess, onError) => {
    firebaseApp
        .database()
        .ref("devices/" + "100000" + "/SOS")
        .on(
            "value",
            (snap) => {
                onSuccess(snap.val());
            },
            onError
        );
};

export const stopSosListener = () => {
    firebaseApp
        .database()
        .ref("devices/" + "100000" + "/SOS")
        .off();
};

export const getStrapDisconnect = (user, deviceId, onSuccess, onError) => {
    firebaseApp
        .database()
        .ref("devices/" + "100000" + "/strapRemove")
        .on(
            "value",
            (snap) => {
                onSuccess(snap.val());
            },
            onError
        );
};

export const stopStrapDisconnectListener = () => {
    firebaseApp
        .database()
        .ref("devices/" + "100000" + "/strapRemove")
        .off();
};

export const getPulse = (user, deviceId, onSuccess, onError) => {
    firebaseApp
        .database()
        .ref("devices/" + "100000" + "/pulse")
        .on(
            "value",
            (snap) => {
                onSuccess(snap.val());
            },
            onError
        );
};

export const stopPulseListener = () => {
    firebaseApp
        .database()
        .ref("devices/" + "100000" + "/pulse")
        .off();
};

export const getBatteryLevel = (user, deviceId, onSuccess, onError) => {
    firebaseApp
        .database()
        .ref("devices/" + "100000" + "/batteryLevel")
        .on(
            "value",
            (snap) => {
                onSuccess(snap.val());
            },
            onError
        );
};

export const stopBatteryLevelListener = () => {
    firebaseApp
        .database()
        .ref("devices/" + "100000" + "/batteryLevel")
        .off();
};
