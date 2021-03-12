import { firebaseApp } from "./init";

export const createNewUser = (
    email,
    password,
    successCallback,
    failureCallback = null,
    type = "ADMIN"
) => {
    if (!(type === "ADMIN" || type === "DOCTOR")) {
        return failureCallback("Bad argument (user type)");
    }
    firebaseApp
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            let user = userCredential.user;
            user.sendEmailVerification()
                .then(() => {
                    if (type === "DOCTOR") {
                        firebaseApp
                            .database()
                            .ref(
                                "DOCTOR/" +
                                    encodeURI(
                                        email
                                            .replace(/\./g, "-")
                                            .replace(/\//g, "-")
                                    ) +
                                    "/adminID"
                            )
                            .once(
                                "value",
                                (snap) => {
                                    const adminId = snap.val();
                                    firebaseApp
                                        .database()
                                        .ref("users/" + user.uid + "/adminId")
                                        .set(adminId)
                                        .then(successCallback)
                                        .catch(console.error);
                                },
                                (err) => console.error(err)
                            )
                            .catch(failureCallback);
                    }
                    successCallback(user);
                })
                .catch((err) => failureCallback(err.message));
        })
        .catch((error) => {
            failureCallback && failureCallback(error.message);
        });
};

export const loginInUser = (
    email,
    password,
    successCallback = null,
    failureCallback = null,
    type = "ADMIN"
) => {
    if (!(type === "ADMIN" || type === "DOCTOR")) {
        return failureCallback("Bad argument (user type)");
    }

    firebaseApp
        .database()
        .ref(
            type +
                "/" +
                encodeURI(email.replace(/\./g, "-").replace(/\//g, "-"))
        )
        .once("value")
        .then((snapshot) => {
            const userType = snapshot.val();
            if (userType === null) {
                console.log(type);
                return failureCallback("NotAllowedError");
            }
            firebaseApp
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in
                    let user = userCredential.user;
                    if (!user.emailVerified) {
                        user.sendEmailVerification()
                            .then(() => successCallback(user))
                            .catch((err) => failureCallback(err.message));
                    } else {
                        successCallback(user);
                    }
                })
                .catch((error) => {
                    // The user doesn't exists but is added by a hospital admin, so create a new user.
                    if (
                        error.code === "auth/user-not-found" &&
                        type === "DOCTOR"
                    ) {
                        createNewUser(
                            email,
                            password,
                            successCallback,
                            failureCallback,
                            (type = "DOCTOR")
                        );
                    } else {
                        failureCallback && failureCallback(error.message);
                    }
                });
        })
        .catch(console.error);
};
