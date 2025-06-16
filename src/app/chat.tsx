import {useLocalSearchParams} from 'expo-router';
import React, {useEffect, useRef, useState} from 'react';
import {
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

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
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const sendMessage = () => {
        if (inputText.trim() === '') return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText.trim(),
            sender: username,
            timestamp: new Date(),
        };

        setMessages([newMessage, ...messages]);
        setInputText('');
    };

    const renderMessage = ({item}: { item: Message }) => (
        <View
            style={[
                styles.messageContainer,
                item.sender === username ? styles.myMessage : styles.otherMessage,
            ]}
        >
            <Text style={styles.senderName}>{item.sender}</Text>
            <Text style={[
                styles.messageText,
                item.sender === username ? styles.myMessageText : styles.otherMessageText
            ]}>
                {item.text}
            </Text>
            <Text style={[
                styles.timestamp,
                item.sender === username ? styles.myTimestamp : styles.otherTimestamp
            ]}>
                {item.timestamp.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
            </Text>
        </View>
    );

    const renderInputComponent = () => (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                multiline
                onFocus={() => {
                    setTimeout(() => flatListRef.current?.scrollToEnd({animated: true}), 200);
                }}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Chat as {username}</Text>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    style={styles.messageList}
                    contentContainerStyle={styles.messageListContent}
                    ListFooterComponent={<View style={{height: 10}}/>}
                    inverted
                    onContentSizeChange={() => {
                        if (messages.length > 0) {
                            flatListRef.current?.scrollToEnd({animated: true});
                        }
                    }}
                    onLayout={() => {
                        if (messages.length > 0) {
                            flatListRef.current?.scrollToEnd({animated: false});
                        }
                    }}
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