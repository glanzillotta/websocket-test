import FontAwesome from '@expo/vector-icons/FontAwesome';
import {useFonts} from 'expo-font';
import {Stack, useSegments} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import 'react-native-reanimated';
import {KeyboardProvider} from 'react-native-keyboard-controller';

import {useColorScheme} from '@/components/useColorScheme';
import {StatusBar} from "react-native";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return <RootLayoutNav/>;
}

function RootLayoutNav() {
const segment = useSegments()
    const page = segment[segment.length - 1];


    return (
        <>
            <StatusBar barStyle='light-content' backgroundColor={'chat'.includes(page)  ? '#007AFF' : '#f5f5f5'} />
            <KeyboardProvider>
                <Stack>
                    <Stack.Screen name="index" options={{headerShown: false}}/>
                    <Stack.Screen name="chat" options={{headerShown: false}}/>
                </Stack>
            </KeyboardProvider>
        </>
    );
}
