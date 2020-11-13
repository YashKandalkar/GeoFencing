import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTheme } from 'react-native-paper';

const OutlinedContainer = (props) => {
    return (
        <View style={{
            ...styles.container, 
            borderColor: props.theme.colors.placeholder, 
            ...props.containerStyle}
        }>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
    }
});

export default withTheme(OutlinedContainer);