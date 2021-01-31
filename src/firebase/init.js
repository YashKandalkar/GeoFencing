import firebase from "firebase/app";

// These imports load individual services into the firebase namespace.
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD2J2PXKl7j7VvZ2PnWZ9KG7U7ZpGtmls0",
    authDomain: "geofencing-703cf.firebaseapp.com",
    projectId: "geofencing-703cf",
    storageBucket: "geofencing-703cf.appspot.com",
    messagingSenderId: "427248434221",
    appId: "1:427248434221:web:13933d186d7227dbd38ca4",
    measurementId: "G-PHMFL36734",
    databaseURL: "https://geofencing-703cf-default-rtdb.firebaseio.com/"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export { firebaseApp };
