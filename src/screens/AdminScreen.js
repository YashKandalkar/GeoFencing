import React from "react";
import { BottomNavigation } from "react-native-paper";
import AdminHospitalSetupTab from "./AdminHospitalSetupTab";
import AdminDoctorTab from "./AdminDoctorTab";
import { StatusBar } from "expo-status-bar";

export default () => {
    const [index, setIndex] = React.useState(0);

    const [routes] = React.useState([
        {
            key: "hospitalSetup",
            title: "Setup Hospital",
            icon: "hospital-building"
        },
        { key: "doctorTab", title: "Doctors", icon: "doctor" }
    ]);

    const renderScene = BottomNavigation.SceneMap({
        hospitalSetup: AdminHospitalSetupTab,
        doctorTab: AdminDoctorTab
    });

    return (
        <>
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
            />
            <StatusBar style="light" />
        </>
    );
};
