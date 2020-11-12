import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTheme } from 'react-native-paper';

import { 
    Surface, 
    Subheading,
    Text,
    TextInput,
    Title,
    Button
} from 'react-native-paper';

const Login = ({ navigation, theme }) => {
    const [text, setText] = React.useState('');
    const [pass, setPass] = React.useState('');
    const { colors } = theme;

    return (
        <View style={{...styles.container}}>
            <Title style={styles.title}>
                Sign in as Admin
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
                    Forgot password?
                </Subheading>

                <Button 
                    mode="outlined" 
                    // color="#2ea44f"
                    uppercase={false}
                    style={{ borderRadius: 6, marginTop: 15 }}
                    contentStyle={{ height: 40 }}
                    onPress={() => navigation.navigate("Admin")}
                >
                    Login as Doctor
                </Button>
                <Button 
                    mode="contained" 
                    // color="#2ea44f"
                    uppercase={false}
                    style={{ borderRadius: 6, marginTop: 15 }}
                    contentStyle={{ height: 40 }}
                    onPress={() => navigation.navigate("Admin")}
                >
                    Sign in
                </Button>
            </Surface>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        marginBottom: 30,
        fontFamily: 'sans-serif-light',
        fontSize: 30
    },
    container: {
      padding: 8,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff'
    },
    loginComponent: {
        padding: 16,
        width: '80%',
        // height: '65%',
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
    }
  });

export default withTheme(Login);