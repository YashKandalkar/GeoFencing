import React from "react";
import { registerRootComponent } from "expo";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { createStore, applyMiddleware } from "redux";
import { Provider as StoreProvider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

import App from "./src/App";
import customTheme from "./src/utils/theme";
import reducer from "./src/reducers/reducer";
import thunk from "redux-thunk";

const theme = {
    ...DefaultTheme,
    ...customTheme
};

const initialState = {
    loginAs: "ADMIN",
    loggedIn: false,
    adminHospitalSetupDone: false
};

const enhancer = composeWithDevTools({})(applyMiddleware(thunk));

const store = createStore(reducer, initialState, enhancer);

const Main = () => {
    return (
        <PaperProvider theme={theme}>
            <StoreProvider store={store}>
                <App />
            </StoreProvider>
        </PaperProvider>
    );
};

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(Main);
