import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { retrieveDoctorChats, listenForNewMessages } from './Auth'
import { UserContext } from './UserContext'

const DEFAULT_IMAGE = require('./assets/images/defaultProfile.png')

type Message = {
  chatID: string
  lastMessage: {
    senderID: string
    text: string
    timestamp: number
    isUnread: boolean
  }
  image?: any // Adjust this type if you know the exact type for image
}

export default function MessagesScreen() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true) // New state for loading
  const { userId } = useContext(UserContext)

  const markMessageAsRead = chatID => {
    setMessages(prevMessages =>
      prevMessages.map(m =>
        m.chatID === chatID ? { ...m, isUnread: false } : m,
      ),
    )
  }

  useEffect(() => {
    const fetchChats = async () => {
      const chats = await retrieveDoctorChats(userId)
      setMessages(chats)

      chats.forEach(chat => {
        listenForNewMessages(chat.chatID, newMessage => {
          setMessages(prevMessages => {
            const updatedChats = prevMessages.map(prevChat => {
              if (prevChat.chatID === chat.chatID) {
                return { ...prevChat, lastMessage: newMessage }
              }
              return prevChat
            })
            return updatedChats
          })
        })
      })

      setLoading(false) // Set loading to false after fetching
    }
    fetchChats()
  }, [userId])

  const unreadMessages = messages.filter(message => message.isUnread)
  const readMessages = messages.filter(message => !message.isUnread)

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color='#1069AD' />
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name='search' size={20} color='grey' />
          <TextInput placeholder='Search' style={styles.searchInput} />
        </View>
        <View style={{ height: 10 }} />
        <View style={styles.avatarContainer}>
          <TouchableOpacity style={styles.avatarAdd}>
            <Ionicons name='add' size={24} color='#1069AD' />
          </TouchableOpacity>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.avatarScroll}>
            {messages.map(message => (
              <TouchableOpacity key={message.chatID}>
                <Image
                  style={styles.avatarImage}
                  source={message.image || DEFAULT_IMAGE}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={{ height: 0 }} />
        {unreadMessages.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Unread</Text>
            {unreadMessages.map(message => (
              <MessageItem
                key={message.chatID}
                message={message.lastMessage}
                image={message.image || DEFAULT_IMAGE}
                onRead={markMessageAsRead} // Pass the function as a prop
              />
            ))}
          </View>
        )}
        <View style={{ height: 0 }} />
        <Text style={styles.sectionTitle}>All Messages</Text>
        {readMessages.map(message => (
          <MessageItem
            key={message.chatID}
            message={message.lastMessage}
            image={message.image || DEFAULT_IMAGE}
            onRead={markMessageAsRead} // Pass the function as a prop
          />
        ))}
        <View style={{ height: 85 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const MessageItem = ({ message, image }) => {
  const { users } = useContext(UserContext)
  console.log(users)

  console.log('Users Context:', users)
  console.log('Current senderID:', message.senderID)
  console.log('Name from Users Context:', users?.[message.senderID]?.name)

  const handleReadMessage = () => {
    if (message.isUnread) {
      // Only mark as read if it's currently unread
      onRead(message.chatID) // Call the passed function with the chatID
    }
  }

  return (
    <TouchableOpacity
      style={styles.messageContainer}
      onPress={handleReadMessage}>
      <Image source={image} style={styles.profileImage} />
      <View style={styles.messageDetails}>
        <Text style={styles.messageName}>
          {users?.[message.senderID]?.name || 'Unknown'}
        </Text>
        <Text style={styles.messageText}>{message.text}</Text>
      </View>
      <View style={styles.messageTimeContainer}>
        <Text style={styles.messageTime}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </Text>
        {message.isUnread && <View style={styles.unreadIndicator} />}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transaparent',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey',
    marginVertical: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  avatarScroll: {
    flexGrow: 0,
    flexShrink: 1,
    backgroundColor: 'transparent',
  },
  avatarAdd: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    width: 50,
    height: 50,
    marginRight: 10,
    borderWidth: 1, // Decreased the borderWidth
    borderColor: 'grey', // Changed color to grey
    borderStyle: 'dotted',
    borderDashOffset: 2, // Added 2px offset for the space between dots
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 8,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  messageDetails: {
    flex: 1,
  },
  messageName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 12,
    color: 'gray',
  },
  messageTime: {
    fontSize: 10,
    color: 'gray',
    marginLeft: 10,
  },
  messageTimeContainer: {
    alignItems: 'center',
    marginLeft: 10,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    backgroundColor: '#1069AD',
    borderRadius: 4,
    marginTop: 4,
  },
})
