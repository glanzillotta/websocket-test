import {useLocalSearchParams} from 'expo-router';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MessageBubble from "@/components/MessageBubble";
import {KeyboardAvoidingView} from "react-native-keyboard-controller";
import useWebSocket from 'react-use-websocket';

interface Message {
    id: string;
    text: string;
    sender: string;
    timestamp: Date;
}

const ChatScreen = () => {
    const {username} = useLocalSearchParams<{ username: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const SOCKET_URL = 'wss://e3b9-37-101-51-118.ngrok-free.app';
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(SOCKET_URL, {
        onOpen: () => {
            console.log('WebSocket connesso');
            sendJsonMessage({
                type: 'auth',
                username: username
            });
            setIsConnected(true);
        },
        onClose: () => {
            console.log('WebSocket disconnesso');
            setIsConnected(false);
        },
        onError: (event) => console.error('Errore WebSocket:', event),
        shouldReconnect: () => true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
    });

    useEffect(() => {
        if (lastJsonMessage) {
            // Il server invia messaggi con questo formato: {userId, text, timestamp}
            const receivedMessage = lastJsonMessage as any;

            if (receivedMessage.userId && receivedMessage.text) {
                const newMessage: Message = {
                    id: new Date().getTime().toString(),
                    text: receivedMessage.text,
                    sender: receivedMessage.userId,
                    timestamp: new Date(receivedMessage.timestamp),
                };
                setMessages(prevMessages => [...prevMessages, newMessage]);

                // Scorri automaticamente verso il basso
                setTimeout(() => flatListRef.current?.scrollToEnd({animated: true}), 100);
            }
        }
    }, [lastJsonMessage]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
                flatListRef.current?.scrollToEnd({animated: true});
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
                setTimeout(() => flatListRef.current?.scrollToEnd({animated: false}), 100);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const sendMessage = () => {
        if (inputText.trim() === '' || !isConnected) return;

        // Invia il messaggio secondo il formato atteso dal server
        sendJsonMessage({
            text: inputText.trim()
        });

        setInputText('');
    };

    const renderMessage = ({item}: { item: Message }) => (
        <MessageBubble message={item} currentUser={username}/>
    );

    const renderInputComponent = () => (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Scrivi un messaggio..."
                multiline
                onFocus={() => {
                    setTimeout(() => flatListRef.current?.scrollToEnd({animated: true}), 200);
                }}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Text style={styles.sendButtonText}>Invia</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={keyboardVisible ? ['top'] : ['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior='padding'
                style={styles.container}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        Chat come {username} {isConnected ? '(Connesso)' : '(Disconnesso)'}
                    </Text>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    style={styles.messageList}
                    contentContainerStyle={styles.messageListContent}
                    ListFooterComponent={<View style={{height: 10}}/>}
                    inverted={false}
                    keyboardDismissMode="none"
                    keyboardShouldPersistTaps="handled"
                />
                {renderInputComponent()}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    header: {
        padding: 15,
        backgroundColor: '#007AFF',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    messageList: {
        flex: 1,
        padding: 10,
    },
    messageListContent: {
        flexGrow: 1,
    },
    messageContainer: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 15,
        marginVertical: 5,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#E5E5EA',
    },
    senderName: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    messageText: {
        fontSize: 16,
    },
    myMessageText: {
        color: '#fff',
    },
    otherMessageText: {
        color: '#000',
    },
    timestamp: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    myTimestamp: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    otherTimestamp: {
        color: '#666',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#007AFF',
        borderRadius: 20,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ChatScreen;