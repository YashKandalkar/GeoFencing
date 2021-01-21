import React from "react";
import { BottomNavigation } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import {
    HospitalSetupTab,
    GeoFencingSetupTab,
    DoctorListTab
} from "../NavigationTabs/Admin";

const AdminScreen = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {
            key: "hospitalSetup",
            title: "Setup Hospital",
            icon: "hospital-building"
        },
        {
            key: "geofencingSetup",
            title: "Setup GeoFencing",
            icon: "crosshairs-gps"
        },
        { key: "doctorTab", title: "Doctors", icon: "doctor" }
    ]);

    const renderScene = BottomNavigation.SceneMap({
        hospitalSetup: HospitalSetupTab,
        geofencingSetup: GeoFencingSetupTab,
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
