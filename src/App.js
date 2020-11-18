import React from 'react';
import { connect } from "react-redux";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { withTheme } from 'react-native-paper';
import LogInScreen from "./screens/LogInScreen";
import AdminScreen from "./screens/Admin";
import DoctorScreen from "./screens/DoctorScreen";

const Stack = createStackNavigator();

function App({ theme, loginAs, loggedIn, ...props }) {
  const { colors } = theme;
  const screenOptions = {
    headerStyle: {
      backgroundColor: colors.primary,
    },
    headerTintColor: '#fff'
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {
          !loggedIn ?
            <Stack.Screen 
              name="Login"
              component={LogInScreen} 
              options={{...screenOptions, title: 'Geo Fencer'}}
            />
          :
            (loginAs == "ADMIN")?
              <Stack.Screen 
                name="Admin" 
                component={AdminScreen} 
                options={screenOptions}
              />
            :
              <Stack.Screen 
                name="Doctor" 
                component={DoctorScreen} 
                options={screenOptions}
              />
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const mapStateToProps = state => {
  return {
      loginAs: state.loginAs,
      loggedIn: state.loggedIn
  };
};


export default connect(mapStateToProps)(withTheme(App));
