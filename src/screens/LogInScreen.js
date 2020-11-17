import React from 'react';
import { connect } from "react-redux";
import LogIn from "../components/LogIn";
import { StatusBar } from "expo-status-bar";
import { setLogger } from '../utils/actions';

const LogInScreen = ({ navigation, loginAs, setLogger, ...props}) => {
    return (
        <>
            <LogIn 
                navigation={navigation} 
                logger={loginAs}
                setLogger={setLogger}
            />
            <StatusBar style="light"/>
        </>
    )
}

const mapStateToProps = state => {
    return {
        loginAs: state.LOGIN_AS
    };
};
const mapDispatchToProps = dispatch => {
  return {
    setLogger: logger => {
      dispatch(setLogger(logger));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogInScreen);