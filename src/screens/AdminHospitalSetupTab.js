import React, { useState } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { connect } from "react-redux";
import {
    Surface,
    Banner,
    Title,
    Paragraph,
    Button,
    Headline
} from "react-native-paper";

import Scroll from "../components/Scroll";
import AdminHospitalSetupForm from "../components/AdminHospitalSetupForm";
import { setAdminHospitalSetup as setAdminHospitalSetupAction } from "../utils/actions";

const AdminHospitalSetupTab = ({ setAdminHospitalSetup, jumpTo }) => {
    const [bannerVisible, setBannerVisible] = useState(false);

    const onSubmit = (data) => {
        console.log(data);
        setAdminHospitalSetup(true);
        jumpTo("geofencingSetup");
    };

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
                    <Paragraph style={{ maxWidth: 280 }}>
                        Please fill out the hospital information and GeoFencing
                        details in the following section.
                    </Paragraph>
                </View>
            </Banner>
            <Scroll>
                <Surface style={styles.container}>
                    <View style={styles.hospitalImageCover}>
                        <ImageBackground
                            source={require("../assets/hospital.webp")}
                            style={styles.imageBackground}
                            imageStyle={{ borderRadius: 8 }}
                        >
                            <View style={styles.childContainer}>
                                <Headline style={styles.title}>
                                    Hospital Cover
                                </Headline>
                                <Button
                                    mode={"contained"}
                                    color={"#eee"}
                                    compact
                                    uppercase={false}
                                    style={{ marginTop: 8 }}
                                >
                                    Click to Edit
                                </Button>
                            </View>
                        </ImageBackground>
                    </View>
                    <AdminHospitalSetupForm onSubmit={onSubmit} />
                </Surface>
            </Scroll>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        elevation: 2,
        // height: 1000,
        borderRadius: 8
    },
    bannerContent: {
        backgroundColor: "rgba(255,229,100,0.3);",
        borderColor: "#ffe564",
        borderLeftWidth: 8,
        paddingVertical: 0,
        alignItems: "center",
        justifyContent: "space-between"
    },
    hospitalImageCover: {
        alignItems: "center",
        flex: 2,
        minHeight: 200,
        alignContent: "center",
        justifyContent: "center"
    },
    imageBackground: {
        flex: 1,
        width: "100%",
        resizeMode: "cover"
    },
    childContainer: {
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 16,
        borderRadius: 8,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        color: "#eee",
        fontSize: 28
    }
});

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => {
    return {
        setAdminHospitalSetup: (value) =>
            dispatch(setAdminHospitalSetupAction(value))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminHospitalSetupTab);
