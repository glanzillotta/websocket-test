import {StyleSheet, Text} from 'react-native';
import Animated, {FadeInUp, LinearTransition} from 'react-native-reanimated';

interface MessageProps {
    message: {
        id: string;
        text: string;
        sender: string;
        timestamp: Date;
    };
    currentUser: string;
}

const MessageBubble = ({ message, currentUser }: MessageProps) => {
    const isMyMessage = message.sender === currentUser;

    return (
        <Animated.View
            entering={FadeInUp.duration(300).springify()}
            layout={LinearTransition}
            style={[
                styles.messageContainer,
                isMyMessage ? styles.myMessage : styles.otherMessage,
            ]}
        >
            <Text style={styles.senderName}>{message.sender}</Text>
            <Text
                style={[
                    styles.messageText,
                    isMyMessage ? styles.myMessageText : styles.otherMessageText,
                ]}
            >
                {message.text}
            </Text>
            <Text
                style={[
                    styles.timestamp,
                    isMyMessage ? styles.myTimestamp : styles.otherTimestamp,
                ]}
            >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
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
});

export default MessageBubble;