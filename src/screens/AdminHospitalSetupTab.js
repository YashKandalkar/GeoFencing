import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Surface, Text, Banner, Title, Paragraph } from "react-native-paper";
import Scroll from "../components/Scroll";

const AdminHospitalSetupTab = () => {
    const [bannerVisible, setBannerVisible] = useState(true);

    // useEffect(() => {
    //     const timer = setTimeout(() => setBannerVisible(true), 5000);
    //     return () => {
    //         clearTimeout(timer);
    //     };
    // }, []);

    return (
        <>
            <Banner
                style={{
                    margin: 8,
                    alignItems: "space-between",
                    justifyContent: "space-between"
                }}
                visible={bannerVisible}
                actions={[
                    {
                        label: "Got It",
                        onPress: () => setBannerVisible(false)
                    }
                ]}
                contentStyle={styles.bannerContent}
                icon={"information"}
            >
                <View>
                    <Title>Welcome to GeoFencer!</Title>
                    <Paragraph style={{ maxWidth: 280, height: "100%" }}>
                        Please fill out the hospital information and GeoFencing
                        details in the following section.
                    </Paragraph>
                </View>
            </Banner>
            <Scroll>
                <Surface style={styles.container}>
                    <Text>Setup the hospital here!</Text>
                </Surface>
            </Scroll>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        elevation: 2,
        height: 2000
    },
    bannerContent: {
        // flex: 1,
        // flexDirection: "column",
        // justifyContent: "space-between",
        // alignContent: "space-between",
        backgroundColor: "rgba(255,229,100,0.3);",
        borderColor: "#ffe564",
        borderLeftWidth: 8
        // borderRadius: 8
    }
});

export default AdminHospitalSetupTab;
