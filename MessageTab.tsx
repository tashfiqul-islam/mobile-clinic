import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import { listenToConversations } from './Auth' // Ensure the path is correct

const MessageTab = ({ navigation }) => {
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    // Assuming the currently logged in user is the doctor
    const doctorId = firebase.auth().currentUser.uid

    // Set up a listener for conversations involving the doctor
    const unsubscribe = listenToConversations(
      firebase.auth().currentUser.uid,
      newConversations => {
        setConversations(newConversations)

        // Add this logging statement
        console.log('Fetched Conversations:', newConversations)
      },
    )

    // Clean up the listener on component unmount
    return () => unsubscribe()
  }, [])

  const unreadChats = conversations.filter(chat => chat.unread)
  const readChats = conversations.filter(chat => !chat.unread)

  return (
    <View style={styles.container}>
      {unreadChats.length > 0 ? (
        <>
          <Text style={styles.sectionHeader}>Unread</Text>
          <FlatList
            data={unreadChats}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ChatItem chat={item} navigation={navigation} />
            )}
          />
        </>
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No unread messages.</Text>
        </View>
      )}

      {readChats.length > 0 ? (
        <>
          <Text
            style={[
              styles.sectionHeader,
              { marginTop: unreadChats.length >= 5 ? 10 : -200 },
            ]}>
            All messages
          </Text>
          <FlatList
            data={readChats}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ChatItem chat={item} navigation={navigation} />
            )}
          />
        </>
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            No messages in the history. Start a conversation to chat!
          </Text>
        </View>
      )}
    </View>
  )
}

const ChatItem = ({ chat, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate('ChatScreen', { conversationId: chat.id })
      }>
      <Image
        source={{
          uri: chat.avatar || 'https://randomuser.me/api/portraits/men/0.jpg',
        }}
        style={styles.avatar}
      />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{chat.name}</Text>
          {chat.online && <View style={styles.onlineIndicator} />}
        </View>
        <Text style={styles.lastMessage}>{chat.lastMessage}</Text>
      </View>
      <Text style={styles.timestamp}>{chat.timestamp}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A3A3A',
    marginTop: 20,
    marginHorizontal: 20,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
    backgroundColor: 'white',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
    flexDirection: 'column',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'green',
    marginLeft: 5,
  },
  lastMessage: {
    fontSize: 14,
    color: '#9A9A9A',
    marginTop: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#C4C4C4',
    marginTop: 5,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
})

export default MessageTab
