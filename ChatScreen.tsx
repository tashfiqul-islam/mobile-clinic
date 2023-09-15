import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Dummy Data for individual chat messages
const messages = [
  { id: 'm1', sender: 'Dr. John Doe', message: 'Hello, how can I assist you?', timestamp: '2:30 PM' },
  { id: 'm2', sender: 'Patient', message: 'I have been feeling a bit dizzy lately.', timestamp: '2:32 PM' },
  // ... (more dummy data can be added here)
];

const ChatScreen = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageItem message={item} />}
      />
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Type a message..." />
        <Ionicons name="send" size={24} color="#1069AD" />
      </View>
    </View>
  );
};

const MessageItem = ({ message }) => {
  const isSentByDoctor = message.sender === 'Dr. John Doe';  // This can be adjusted based on the app's logic
  return (
    <View style={isSentByDoctor ? styles.sentMessageContainer : styles.receivedMessageContainer}>
      <Text style={isSentByDoctor ? styles.sentMessage : styles.receivedMessage}>{message.message}</Text>
      <Text style={styles.timestamp}>{message.timestamp}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  sentMessageContainer: {
    alignSelf: 'flex-end',
    marginRight: 15,
    marginBottom: 10,
  },
  receivedMessageContainer: {
    alignSelf: 'flex-start',
    marginLeft: 15,
    marginBottom: 10,
  },
  sentMessage: {
    backgroundColor: '#1069AD',
    color: 'white',
    padding: 10,
    borderRadius: 15,
    maxWidth: '70%',
  },
  receivedMessage: {
    backgroundColor: '#E0E0E0',
    color: '#333',
    padding: 10,
    borderRadius: 15,
    maxWidth: '70%',
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    marginRight: 10,
  },
});

export default ChatScreen;