import React from "react";
import { BottomNavigation } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import {
    HospitalSetupTab,
    GeoFencingSetupTab,
    AccessPointSetup,
    DoctorListTab
} from "../NavigationTabs/Admin";

const AdminScreen = ({ navigation }) => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {
            key: "hospitalSetup",
            title: "Setup Hospital",
            icon: "hospital-building"
        },
        {
            key: "geofencingSetup",
            title: "GeoFencing",
            icon: "crosshairs-gps"
        },
        {
            key: "accessPointSetup",
            title: "Reference Points",
            icon: "map-marker-multiple"
        },
        {
            key: "doctorTab",
            title: "Doctors",
            icon: "doctor",
            navigation
        }
    ]);

    const renderScene = BottomNavigation.SceneMap({
        hospitalSetup: HospitalSetupTab,
        geofencingSetup: GeoFencingSetupTab,
        accessPointSetup: () => <AccessPointSetup currIndex={index} />,
        doctorTab: DoctorListTab
    });

    return (
        <>
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
                shifting
            />
            <StatusBar style="light" />
        </>
    );
};

export default AdminScreen;
