import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import DoctorList from "../components/DoctorList";

const AdminScreen = ({ navigation }) => {
  return (
    <>
      <View>
        <Text>Admin Screen</Text>
        <DoctorList />
      </View>
      <StatusBar style="light" />
    </>
  );
};

export default AdminScreen;
