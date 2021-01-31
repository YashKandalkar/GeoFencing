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
            firebaseApp
                .database()
                .ref(
                    type +
                        "/" +
                        encodeURI(email.replace(/\./g, "-").replace(/\//g, "-"))
                )
                .set(true)
                .then((r) => {
                    console.log(r);
                    user.sendEmailVerification()
                        .then(() => {
                            successCallback(user);
                        })
                        .catch((err) => failureCallback(err.message));
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
                    failureCallback && failureCallback(error.message);
                });
        })
        .catch(console.error);
};
