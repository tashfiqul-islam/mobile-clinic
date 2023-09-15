import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Dummy Data
const chats = [
  { id: '1', name: 'Dr. John Doe', lastMessage: 'Hello, how can I assist you?', timestamp: '2:30 PM', unread: true, online: true, avatar: 'https://via.placeholder.com/50' },
  { id: '2', name: 'Dr. Jane Smith', lastMessage: 'Your report looks fine.', timestamp: 'Yesterday', unread: false, online: false, avatar: 'https://via.placeholder.com/50' },
  // ... (more dummy data can be added here)
];

const MessageTab = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatItem chat={item} navigation={navigation} />}
      />
    </View>
  );
};

const ChatItem = ({ chat, navigation }) => {
  return (
    <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate('ChatScreen')}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatarBorder}>
          <Image source={{ uri: chat.avatar }} style={styles.avatar} />
        </View>
        {chat.online && <View style={styles.onlineIndicator}></View>}
      </View>
      <View style={styles.chatInfo}>
        <Text style={[styles.name, chat.unread ? styles.boldText : null]}>{chat.name}</Text>
        <Text style={[styles.lastMessage, chat.unread ? styles.boldText : null]}>{chat.lastMessage}</Text>
      </View>
      <Text style={styles.timestamp}>{chat.timestamp}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarBorder: {
    borderWidth: 1,
    borderColor: '#1069AD',
    borderRadius: 26,
    padding: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: 2,
    right: 2,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#F5F5F5',  // This will give the 3D effect by adding a border to the online indicator
  },
  chatInfo: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    color: '#333',
  },
  lastMessage: {
    color: '#777',
    marginTop: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default MessageTab;