import { firebaseApp } from "./init";

export const setHospitalData = (
    user,
    data,
    successCallback,
    failureCallback
) => {
    firebaseApp
        .database()
        .ref("users/" + user.uid + "/hospitalData")
        .set(data)
        .then((r) => successCallback(r))
        .catch((err) => failureCallback(err));
};

export const setGeofencingData = (
    user,
    data,
    successCallback,
    failureCallback
) => {
    firebaseApp
        .database()
        .ref("users/" + user.uid + "/geofencingData")
        .set(data)
        .then((r) => successCallback(r))
        .catch((err) => failureCallback(err));
};

export const getAdminData = (user, onSuccess, onError) => {
    let adminDataRef = firebaseApp.database().ref("users/" + user.uid);
    adminDataRef
        .once("value")
        .then((snapshot) => {
            onSuccess(snapshot.val());
        })
        .catch(onError);
};
export const uploadHospitalMap = async (
    user,
    uri,
    onProgress,
    onError,
    onSuccess
) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    let ref = firebaseApp.storage().ref(user.uid).child("hospitalFloorMap");
    let uploadTask = ref.put(blob);
    uploadTask.on(
        "state_changed",
        (snap) => onProgress(snap.bytesTransferred / snap.totalBytes),
        onError,
        onSuccess
    );
    return uploadTask;
};
