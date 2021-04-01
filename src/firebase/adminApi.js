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

export const getAdminData = (user, successCallback, failureCallback) => {
    let adminDataRef = firebaseApp.database().ref("users/" + user.uid);
    adminDataRef
        .once("value")
        .then((snapshot) => {
            successCallback(snapshot.val());
        })
        .catch(failureCallback);
};

export const getAccessPoints = (user, successCallback, failureCallback) => {
    firebaseApp
        .database()
        .ref("users/" + user.uid + "/accessPoints")
        .on(
            "value",
            (snapshot) => {
                successCallback(snapshot.val());
            },
            failureCallback
        );
};

export const stopAccessPointsListener = (user) => {
    firebaseApp
        .database()
        .ref("users/" + user.uid + "/accessPoints")
        .off();
};

export const uploadHospitalMap = async (
    user,
    image,
    onProgress,
    failureCallback,
    successCallback
) => {
    const response = await fetch(image.uri);
    const blob = await response.blob();
    let ref = firebaseApp.storage().ref(user.uid).child("hospitalFloorMap");
    let uploadTask = ref.put(blob);
    uploadTask.on(
        "state_changed",
        (snap) => onProgress(snap.bytesTransferred / snap.totalBytes),
        failureCallback,
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                firebaseApp
                    .database()
                    .ref("users/" + user.uid + "/hospitalFloorMap")
                    .set({ ...image, uri: downloadURL })
                    .then(() => successCallback(downloadURL))
                    .catch((err) => failureCallback(err));
            });
        }
    );
    return uploadTask;
};

export const deleteHospitalMap = (user, successCallback, failureCallback) => {
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
                .then(successCallback)
                .catch(failureCallback);
        })
        .catch(failureCallback);
};

export const deleteHospitalData = (user, successCallback, failureCallback) => {
    firebaseApp
        .database()
        .ref("users/" + user.uid + "/hospitalData")
        .remove()
        .then(successCallback)
        .catch(failureCallback);
};

export const addDoctor = (
    user,
    email,
    data,
    successCallback,
    failureCallback
) => {
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
            successCallback();
        })
        .catch((err) => failureCallback(err.message));
};

export const deleteDoctor = (
    user,
    email,
    data,
    successCallback,
    failureCallback
) => {
    firebaseApp
        .database()
        .ref(
            "DOCTOR" +
                "/" +
                encodeURI(email.replace(/\./g, "-").replace(/\//g, "-"))
        )
        .remove()
        .then(() => {
            setDoctorList(user, data, successCallback, failureCallback);
        })
        .catch(failureCallback);
};
