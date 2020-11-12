import React from 'react';
import LogIn from "../components/LogIn";
import { StatusBar } from "expo-status-bar";

const LogInScreen = ({ navigation }) => {
    return (
        <>
            <LogIn navigation={navigation}/>
            <StatusBar style="light"/>
        </>
    )
}

export default LogInScreen;