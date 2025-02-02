import React from "react";
import { connect } from "react-redux";
import { LogIn } from "../components";
import { StatusBar } from "expo-status-bar";
import { setLoginAs } from "../redux/mainReduxDuck";

const LogInScreen = ({ navigation, loginAs, setLoginAs, ...props }) => {
    return (
        <>
            <LogIn
                navigation={navigation}
                loginAs={loginAs}
                setLoginAs={setLoginAs}
            />
            <StatusBar style="light" />
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        loginAs: state.loginAs
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        setLoginAs: (loginAs) => {
            dispatch(setLoginAs(loginAs));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LogInScreen);
