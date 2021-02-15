import React from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider as StoreProvider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-community/async-storage";

import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import thunk from "redux-thunk";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import reducer from "./mainReduxDuck";
import initialState from "./initialState";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    stateReconciler: autoMergeLevel2,
    blacklist: ["loggedIn"]
};

const pReducer = persistReducer(persistConfig, reducer);

const enhancer = composeWithDevTools({})(applyMiddleware(thunk));

const store = createStore(pReducer, initialState, enhancer);
const pStore = persistStore(store);

const renderLoading = () => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator animating={true} size={"large"} />
    </View>
);

export default ({ children }) => {
    return (
        <StoreProvider store={store}>
            <PersistGate persistor={pStore} loading={renderLoading()}>
                {children}
            </PersistGate>
        </StoreProvider>
    );
};
