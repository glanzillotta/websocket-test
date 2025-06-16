import {Button, Image, StyleSheet, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useState} from "react";
import {router} from "expo-router";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";

const Home = () => {
    const [username, setUsername] = useState("");

    const handleStartChat = () => {
        if (username.trim() === "") return;
        router.push({
            pathname: "/chat",
            params: {username: username.trim()}
        });
    };

    return (
        <KeyboardAwareScrollView
            bottomOffset={62}
            style={{flex: 1, marginBottom: 62}}
            contentContainerStyle={styles.container}
        >
            <SafeAreaView style={styles.container}>
                <Image source={require('../assets/images/wired-brain-coffee-logo.png')}/>
                <View style={styles.inputContainer}>
                    <Text style={styles.title}>Please enter your name</Text>
                    <TextInput
                        placeholder="Enter your name"
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>
                <Button
                    title="Start chatting"
                    onPress={handleStartChat}
                    disabled={username.trim() === ""}
                />
            </SafeAreaView>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 50,
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: 'black',
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        margin: 10,
        width: 250,
        borderRadius: 5,
    },
});

export default Home;