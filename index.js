import React from "react";
import { registerRootComponent } from "expo";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import App from "./src/App";
import customTheme from "./src/utils/theme";
import PersistentStore from "./src/redux/PersistentStore";
import { LogBox } from "react-native";

const theme = {
    ...DefaultTheme,
    ...customTheme
};

const Main = () => {
    LogBox.ignoreLogs([
        "Setting a timer",
        "Warning: componentWillReceiveProps has been renamed"
    ]);
    return (
        <PaperProvider theme={theme}>
            <PersistentStore>
                <App />
            </PersistentStore>
        </PaperProvider>
    );
};

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(Main);
