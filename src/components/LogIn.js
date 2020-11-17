import React from 'react';
import { withTheme } from 'react-native-paper';

import { 
    StyleSheet, 
    View, 
    ScrollView,
    SafeAreaView
} from 'react-native';

import { 
    Surface, 
    Subheading,
    Text,
    TextInput,
    Title,
    Button
} from 'react-native-paper';

import OutlinedContainer from './OutlinedContainer';

const Login = ({ navigation, logger, setLogger, ...props }) => {
    const isAdmin = logger == "ADMIN";

    const onLoginAsClick = () => {
        if(isAdmin) {
            setLogger('DOCTOR');
        } else {
            setLogger('ADMIN');
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ flex:1 }} contentContainerStyle={ styles.scrollViewContent }>
                <Title style={styles.title}>
                    {
                        isAdmin?
                            "Sign in as Admin"
                            :"Sign in as Doctor"
                    }
                </Title> 
                <Surface 
                    style={styles.loginComponent}
                >
                    <View style={styles.formItem}>
                        <Text style={styles.textFieldHeading}>Email address</Text>
                        <TextInput
                            mode="outlined"
                            style={{ height: 40, backgroundColor: "#fff"  }}
                            placeholder="email@example.com"
                            onChangeText={text => setText(text)}
                            value={text}
                        />
                    </View>
                    <View style={styles.formItem}>
                        <Text style={styles.textFieldHeading}>Password</Text>
                        <TextInput
                            mode="outlined"
                            style={{ height: 40, backgroundColor: "#fff" }}
                            placeholder="password"
                            textContentType="password"
                            secureTextEntry
                            onChangeText={text => setPass(text)}
                            value={pass}
                        /> 
                    </View>

                    <Subheading style={{
                        textAlign: "right",
                        fontSize: 14,
                        color: "#0366d6",
                        fontFamily: 'sans-serif-medium'
                    }}>
                        {"Forgot password?"}
                    </Subheading>

                    <Button 
                        mode="outlined" 
                        uppercase={false}
                        style={{ borderRadius: 6, marginTop: 15 }}
                        contentStyle={{ height: 40 }}
                        onPress={onLoginAsClick}
                    >
                        {
                            isAdmin?
                                "Login as Doctor"
                                :"Login as Admin"
                        }
                    </Button>
                    <Button 
                        mode="contained" 
                        uppercase={false}
                        style={{ borderRadius: 6, marginTop: 15 }}
                        contentStyle={{ height: 40 }}
                        onPress={() => navigation.navigate("Admin")}
                    >
                        {"Sign in"}
                    </Button>
                </Surface>
                <OutlinedContainer containerStyle={styles.outlinedContainer}>
                    <Subheading style={{ fontFamily: 'sans-serif-light' }}>
                        {"Check our guildlines for patients"}
                    </Subheading>
                </OutlinedContainer>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    title: {
        marginBottom: 48,
        fontFamily: 'sans-serif-light',
        fontSize: 30
    },
    container: {
        flex: 1,
    },
    scrollViewContent: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        minHeight: '100%'
    },
    loginComponent: {
        padding: 16,
        width: '80%',
        maxWidth: 400,
        elevation: 1,
        borderRadius: 6
    },
    textFieldHeading: {
        fontFamily: 'sans-serif-light',
        fontSize: 16,
    },
    formItem: {
        // marginTop: 10,
        marginBottom: 15
    },
    outlinedContainer: {
        width: '80%',
        maxWidth: 400,
        marginTop: 75,
        marginBottom: 16,
        alignItems: 'center',
        borderColor: '#ddd',
        paddingVertical: 16
    },
  });

export default withTheme(Login);