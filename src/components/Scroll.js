import React from "react";
import { ScrollView } from "react-native";

const Scroll = ({ children, contentStyles }) => {
    return (
        <ScrollView
            style={{ flex: 1 }}
            bounces
            bouncesZoom
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
