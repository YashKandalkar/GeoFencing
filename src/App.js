import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { withTheme } from 'react-native-paper';
import LogInScreen from "./screens/LogInScreen";
import AdminScreen from "./screens/Admin";

const Stack = createStackNavigator();

function App(props) {
  const { colors } = props.theme;
  const screenOptions = {
    headerStyle: {
      backgroundColor: colors.primary,
    },
    headerTintColor: '#fff'
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login"
          component={LogInScreen} 
          options={{...screenOptions, title: 'Geo Fencer'}}
        />
        <Stack.Screen 
          name="Admin" 
          component={AdminScreen} 
          options={screenOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


export default withTheme(App);
