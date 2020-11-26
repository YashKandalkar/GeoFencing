import React from "react";
import { connect } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { withTheme, IconButton } from "react-native-paper";
import LogInScreen from "./screens/LogInScreen";
import AdminScreen from "./screens/AdminScreen";
import DoctorScreen from "./screens/DoctorScreen";
import { setLoggedIn as setLoggedInAction } from "./utils/actions";

const Stack = createStackNavigator();

function App({ theme, loginAs, loggedIn, setLoggedIn, ...props }) {
  const { colors } = theme;
  const screenOptions = {
    headerStyle: {
      backgroundColor: colors.primary,
    },
    headerTintColor: "#fff",
  };

  const logoutButton = () => (
    <IconButton
      icon="account-arrow-right"
      color={"#fff"}
      size={24}
      onPress={() => setLoggedIn(false)}
    />
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!loggedIn ? (
          <Stack.Screen
            name="Login"
            component={LogInScreen}
            options={{ ...screenOptions, title: "Geo Fencer" }}
          />
        ) : loginAs === "ADMIN" ? (
          <Stack.Screen
            name="Admin"
            component={AdminScreen}
            options={{ ...screenOptions, headerRight: logoutButton }}
          />
        ) : (
          <Stack.Screen
            name="Doctor"
            component={DoctorScreen}
            options={{ ...screenOptions, headerRight: logoutButton }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const mapStateToProps = (state) => {
  return {
    loginAs: state.loginAs,
    loggedIn: state.loggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLoggedIn: (loggedIn) => dispatch(setLoggedInAction(loggedIn)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(App));
