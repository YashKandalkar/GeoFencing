import React from "react";
import { registerRootComponent } from "expo";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import App from "./src/App";
import customTheme from "./src/utils/theme";
import PersistentStore from "./src/redux/PersistentStore";

const theme = {
    ...DefaultTheme,
    ...customTheme
};

const Main = () => {
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
