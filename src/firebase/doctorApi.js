import { firebaseApp } from "./init";

export const getHospitalDetails = (user, onSuccess, onError) => {
    firebaseApp
        .database()
        .ref("users/" + user.uid + "/adminId")
        .once("value")
        .then((snap) => {
            const adminId = snap.val();
            console.log({ adminId });
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
