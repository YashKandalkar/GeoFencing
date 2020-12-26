import React from "react";
import { View } from "react-native";
import { registerRootComponent } from "expo";
import {
    DefaultTheme,
    Provider as PaperProvider,
    ActivityIndicator
} from "react-native-paper";
import { createStore, applyMiddleware } from "redux";
import { Provider as StoreProvider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-community/async-storage";

import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

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
    adminHospitalSetupDone: false,
    hospitalData: null
};

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    stateReconciler: autoMergeLevel2
};

const pReducer = persistReducer(persistConfig, reducer);

const enhancer = composeWithDevTools({})(applyMiddleware(thunk));

const store = createStore(pReducer, initialState, enhancer);
const pStore = persistStore(store);

const Main = () => {
    const renderLoading = () => (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <ActivityIndicator animating={true} size={"large"} />
        </View>
    );
    return (
        <PaperProvider theme={theme}>
            <StoreProvider store={store}>
                <PersistGate persistor={pStore} loading={renderLoading()}>
                    <App />
                </PersistGate>
            </StoreProvider>
        </PaperProvider>
    );
};

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(Main);
