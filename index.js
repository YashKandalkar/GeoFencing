import React from 'react';
import { registerRootComponent } from 'expo';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import customTheme from "./src/utils/theme";

const theme = {
  ...DefaultTheme,
  ...customTheme
};

console.log(DefaultTheme);

import App from './src/App';

const Main = () => {
    return (
      <PaperProvider theme={theme}>
        <App />
      </PaperProvider>
    );
  }

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(Main);
