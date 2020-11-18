import React from 'react';
import { connect } from "react-redux";
import LogIn from "../components/LogIn";
import { StatusBar } from "expo-status-bar";
import { setLoginAs as setLoginAsAction } from '../utils/actions';

const LogInScreen = ({ navigation, loginAs, setLoginAs, ...props}) => {
    return (
        <>
            <LogIn 
                navigation={navigation} 
                loginAs={loginAs}
                setLoginAs={setLoginAs}
            />
            <StatusBar style="light"/>
        </>
    )
}

const mapStateToProps = state => {
    return {
        loginAs: state.loginAs
    };
};
const mapDispatchToProps = dispatch => {
  return {
    setLoginAs: loginAs => {
      dispatch(setLoginAsAction(loginAs));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogInScreen);