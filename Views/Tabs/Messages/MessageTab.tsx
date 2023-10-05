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
import { retrieveDoctorChats, listenForNewMessages } from './../../../Auth'
import { UserContext } from './../../../UserContext'
import { useNavigation } from '@react-navigation/native'
import ConversationItem from './ConversationItem'
import firebase from 'firebase/compat/app'
import 'firebase/compat/database'

const DEFAULT_IMAGE = require('../../../assets/images/ms-1.jpeg')

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
  const navigation = useNavigation()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true) // New state for loading
  const { userId } = useContext(UserContext)
  const [patientName, setPatientName] = useState<string>('')

  let interval = null

  useEffect(() => {
    fetchChats()
    interval = setInterval(() => {
      fetchChats()
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const fetchChats = async () => {
    const chats = await retrieveDoctorChats(userId)

    // Sort the chats based on the timestamp of the last message
    const sortedChats = chats.sort(
      (a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp,
    )
    setMessages(sortedChats)

    setLoading(false) // Set loading to false after fetching

    // Fetch patient name for each chat and store it in the messages array
    for (const chat of sortedChats) {
      fetchPatientName(chat.chatID)
    }
  }

  const fetchPatientName = async (chatID: string) => {
    try {
      const chatRef = firebase.database().ref(`chats/${chatID}`)
      const chatDataSnapshot = await chatRef.once('value')
      const chatData = chatDataSnapshot.val()

      if (!chatData) {
        console.error('No chat data found for chatID:', chatID)
        return
      }

      const patientID = chatData.patientID
      const userRef = firebase.database().ref(`users/${patientID}`)
      const userDataSnapshot = await userRef.once('value')
      const patientFullName = userDataSnapshot.val().fullName

      setPatientName(patientFullName)

      // Update the message with the patientName
      setMessages(prevMessages =>
        prevMessages.map(m =>
          m.chatID === chatID ? { ...m, patientName: patientFullName } : m,
        ),
      )
    } catch (error) {
      console.error('Error fetching patient name:', error)
    }
  }

  const markMessageAsRead = async chatID => {
    setMessages(prevMessages =>
      prevMessages.map(m =>
        m.chatID === chatID
          ? { ...m, lastMessage: { ...m.lastMessage, isUnread: false } }
          : m,
      ),
    )
    await fetchChats()
  }

  const unreadMessages = messages.filter(
    message => message.lastMessage.isUnread,
  )
  const allMessages = messages.filter(message => !message.lastMessage.isUnread)

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
              <TouchableOpacity
                key={message.chatID}
                onPress={() => {
                  console.log('Navigating with chatID:', message.chatID)
                  navigation.navigate('ChatScreen', { chatID: message.chatID })
                }}>
                <View style={styles.avatarBorder}>
                  <Image
                    style={styles.avatarImage}
                    source={message.image || DEFAULT_IMAGE}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={{ height: 0 }} />
        {unreadMessages.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Unread</Text>
            {unreadMessages.map(message => (
              <ConversationItem
                key={message.chatID}
                conversation={{
                  ...message.lastMessage,
                  chatID: message.chatID,
                }}
                image={message.image || DEFAULT_IMAGE}
                onRead={markMessageAsRead}
                navigation={navigation}
                patientName={patientName} // Pass patientName as a prop
              />
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>All Messages</Text>
        {allMessages.map(message => (
          <ConversationItem
            key={message.chatID}
            conversation={{ ...message.lastMessage, chatID: message.chatID }}
            image={message.image || DEFAULT_IMAGE}
            onRead={markMessageAsRead}
            navigation={navigation}
            patientName={patientName} // Pass patientName as a prop
          />
        ))}
        <View style={{ height: 85 }} />
      </ScrollView>
    </SafeAreaView>
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
    borderRadius: 30,
    width: 55,
    height: 55,
    marginRight: 10,
    borderWidth: 1, // Decreased the borderWidth
    borderColor: 'grey', // Changed color to grey
    borderStyle: 'dotted',
    borderDashOffset: 2, // Added 2px offset for the space between dots
  },
  avatarBorder: {
    borderWidth: 2,
    borderColor: '#1069AD',
    borderRadius: 30, // Increased to account for the border and padding
    padding: 1.5, // This creates the tiny gap
    marginRight: 10, // Adjust margin if needed
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    borderWidth: 0.8,
    borderColor: 'black',
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
    marginLeft: 10,
  },
})
