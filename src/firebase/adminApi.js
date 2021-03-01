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

export const setAccessPoints = (
    user,
    data,
    successCallback,
    failureCallback
) => {
    firebaseApp
        .database()
        .ref("users/" + user.uid + "/accessPoints")
        .set(data)
        .then((r) => successCallback(r))
        .catch((err) => failureCallback(err));
};

export const setDoctorList = (user, data, successCallback, failureCallback) => {
    firebaseApp
        .database()
        .ref("users/" + user.uid + "/doctorList")
        .set(data)
        .then(() => successCallback())
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

export const getAccessPoints = (user, onSuccess, onError) => {
    firebaseApp
        .database()
        .ref("users/" + user.uid + "/accessPoints")
        .on(
            "value",
            (snapshot) => {
                onSuccess(snapshot.val());
            },
            onError
        );
};

export const uploadHospitalMap = async (
    user,
    image,
    onProgress,
    onError,
    onSuccess
) => {
    const response = await fetch(image.uri);
    const blob = await response.blob();
    let ref = firebaseApp.storage().ref(user.uid).child("hospitalFloorMap");
    let uploadTask = ref.put(blob);
    uploadTask.on(
        "state_changed",
        (snap) => onProgress(snap.bytesTransferred / snap.totalBytes),
        onError,
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                firebaseApp
                    .database()
                    .ref("users/" + user.uid + "/hospitalFloorMap")
                    .set({ ...image, uri: downloadURL })
                    .then(() => onSuccess(downloadURL))
                    .catch((err) => onError(err));
            });
        }
    );
    return uploadTask;
};

export const deleteHospitalMap = (user, onSuccess, onError) => {
    firebaseApp
        .storage()
        .ref(user.uid)
        .child("hospitalFloorMap")
        .delete()
        .then(() => {
            firebaseApp
                .database()
                .ref("users/" + user.uid + "/hospitalFloorMap")
                .remove()
                .then(onSuccess)
                .catch(onError);
        })
        .catch(onError);
};

export const deleteHospitalData = (user, onSuccess, onError) => {
    firebaseApp
        .database()
        .ref("users/" + user.uid + "/hospitalData")
        .remove()
        .then(onSuccess)
        .catch(onError);
};

export const addDoctor = (user, email, data, onSuccess, onError) => {
    const formattedData = {};
    for (let key of Object.keys(data)) {
        formattedData[key] = encodeURIComponent(data[key]).replace(
            /\./g,
            "%2E"
        );
    }
    formattedData["adminID"] = user.uid;
    delete formattedData[email];
    firebaseApp
        .database()
        .ref(
            "DOCTOR" +
                "/" +
                encodeURI(email.replace(/\./g, "-").replace(/\//g, "-"))
        )
        .set(formattedData)
        .then(() => {
            onSuccess();
        })
        .catch((err) => onError(err.message));
};

export const deleteDoctor = (user, email, data, onSuccess, onError) => {
    firebaseApp
        .database()
        .ref(
            "DOCTOR" +
                "/" +
                encodeURI(email.replace(/\./g, "-").replace(/\//g, "-"))
        )
        .remove()
        .then(() => {
            setDoctorList(user, data, onSuccess, onError);
        })
        .catch(onError);
};
