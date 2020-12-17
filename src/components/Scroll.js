import React from "react";
import { ScrollView } from "react-native";

const Scroll = ({ children, contentStyles }) => {
    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
                padding: 8,
                justifyContent: "center",
                backgroundColor: "#fff",
                minHeight: "100%",
                ...contentStyles
            }}
        >
            {children}
        </ScrollView>
    );
};

export default Scroll;
