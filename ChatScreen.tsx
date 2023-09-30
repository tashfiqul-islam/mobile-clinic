import React, { useState, useRef, useEffect } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Platform,
  Keyboard,
  Image,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import { sendMessage, onNewMessage, initializeChat } from './Auth'
import moment from 'moment'

const DEFAULT_IMAGE_URL =
  'https://firebasestorage.googleapis.com/v0/b/mclinic-df2b5.appspot.com/o/profile_images%2FdefaultProfile.png?alt=media&token=600ebca7-a028-428c-9199-3bd7464cf216'

const ChatScreen = () => {
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([])
  const [userData, setUserData] = useState({
    name: '',
    profileImage: DEFAULT_IMAGE_URL,
  })
  const scrollViewRef = useRef(null)
  const navigation = useNavigation()
  const route = useRoute()
  const conversationId = route.params.conversationId
  const currentUserId = firebase.auth().currentUser?.uid
  const otherUserId = route.params.otherUserId

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = firebase.database().ref(`users/${otherUserId}`)
      const snapshot = await userRef.once('value')
      const fetchedData = snapshot.val()
      if (fetchedData) {
        setUserData({
          name: fetchedData.fullName || '',
          profileImage: fetchedData.profileImage || DEFAULT_IMAGE_URL,
        })
      }
    }

    fetchUserData()
  }, [otherUserId])

  useEffect(() => {
    const setListeners = async () => {
      if (!conversationId) {
        const newChatId = await initializeChat(otherUserId, currentUserId)
      }

      onNewMessage(conversationId, newMessages => {
        setMessages(newMessages)
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      })
    }

    setListeners()
  }, [conversationId])

  const handleSend = async () => {
    if (text.trim() !== '') {
      const senderId = firebase.auth().currentUser.uid
      await sendMessage(conversationId, senderId, text)
      setText('')
    }
  }

  const handleAttachment = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri
      const senderId = firebase.auth().currentUser.uid
      await sendMessage(conversationId, senderId, '', selectedImageUri)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name='arrow-back-sharp'
          size={30}
          color='#1069AD'
          style={styles.iconLeft}
          onPress={() => navigation.goBack()}
        />
        <Image
          source={{ uri: userData.profileImage }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{userData.name}</Text>
        <View style={styles.statusPill}>
          <Ionicons name='ellipse-sharp' size={8} color='green' />
          <Text style={styles.statusText}>Online</Text>
        </View>
        <Ionicons
          name='ios-videocam-outline'
          size={30}
          color='#1069AD'
          style={styles.iconRight}
        />
        <Ionicons
          name='ios-call-outline'
          size={25}
          color='#1069AD'
          style={styles.iconRight}
        />
      </View>
      <ScrollView
        style={styles.chatContainer}
        ref={scrollViewRef}
        keyboardShouldPersistTaps='handled'>
        {messages.map(item => (
          <View
            key={item.id}
            style={
              item.senderId === currentUserId
                ? styles.selfMessageContainer
                : styles.otherMessageContainer
            }>
            <View
              style={
                item.senderId === currentUserId
                  ? styles.selfMessageBubble
                  : styles.otherMessageBubble
              }>
              {item.attachment && (
                <Image
                  source={{ uri: item.attachment }}
                  style={styles.attachmentImage}
                />
              )}
              <Text
                style={
                  item.senderId === currentUserId
                    ? styles.selfMessageText
                    : styles.otherMessageText
                }>
                {item.text}
              </Text>
            </View>
            <View style={styles.timestampContainer}>
              {item.senderId === currentUserId && (
                <Ionicons
                  name={
                    item.status === 'sent'
                      ? 'ios-checkmark'
                      : 'ios-checkmark-done'
                  }
                  size={16}
                  color='#1069AD'
                />
              )}
              <Text style={styles.timestamp}>
                {moment.utc(item.clientTimestamp?.toDate()).format('hh:mm A')}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <Ionicons
          name='ios-attach-outline'
          size={30}
          color='#1069AD'
          style={styles.iconLeft}
          onPress={handleAttachment}
        />
        <TextInput
          style={styles.input}
          placeholder='Type your message...'
          placeholderTextColor='#1069AD'
          value={text}
          onChangeText={setText}
          multiline={true}
        />
        <Ionicons
          name='ios-send-sharp'
          size={30}
          color='#1069AD'
          style={styles.iconRight}
          onPress={handleSend}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#D1D1D1',
    borderBottomWidth: 1,
    backgroundColor: '#E4E4E4',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1069AD',
    marginLeft: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  statusText: {
    fontSize: 12,
    color: 'green',
    marginLeft: 5,
  },
  iconLeft: {
    marginLeft: 5,
  },
  iconRight: {
    marginRight: 5,
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  selfMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  selfMessageBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    padding: 10,
    maxWidth: '70%',
  },
  otherMessageBubble: {
    backgroundColor: '#1069AD',
    borderRadius: 10,
    padding: 10,
    maxWidth: '70%',
  },
  selfMessageText: {
    color: '#000',
    fontSize: 16,
  },
  otherMessageText: {
    color: '#FFF',
    fontSize: 16,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  timestamp: {
    marginLeft: 5,
    color: '#1069AD',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopColor: '#D1D1D1',
    borderTopWidth: 1,
    backgroundColor: '#E4E4E4',
  },
  input: {
    flex: 1,
    color: '#1069AD',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 5,
  },
  attachmentImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
})

export default ChatScreen
