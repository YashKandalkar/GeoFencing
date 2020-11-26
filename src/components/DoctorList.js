import React from 'react';
import DoctorListItem from './DoctorListItem';
import { Surface } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const DoctorList = () => {
    return (
        <Surface style={styles.container}>
            <DoctorListItem />
            <DoctorListItem />
            <DoctorListItem />
            <DoctorListItem />
            <DoctorListItem />        
        </Surface>
    )
}

const styles = StyleSheet.create({
    container: {
        elevation: 2,
        marginHorizontal: 6
    }
})

export default DoctorList;