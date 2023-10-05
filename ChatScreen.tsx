import React, { useState, useEffect, useContext, useRef } from 'react'
import {
  View,
  Text,
  ViewStyle,
  ImageStyle,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
} from '@expo/vector-icons'
import LinearGradient from 'react-native-linear-gradient'
import * as ImagePicker from 'expo-image-picker'
import * as Burnt from 'burnt'
import { useNavigation, useRoute } from '@react-navigation/native'
import { UserContext } from './UserContext'
import { firebaseConfig } from './firebaseConfig'
import { listenForNewMessages, postMessage, addChatAttachment } from './Auth'
import firebase from 'firebase/compat/app'
import 'firebase/compat/database'
import moment from 'moment'

interface Message {
  senderID: string
  text: string
  timestamp: number
  attachmentURL?: string
}

type RouteParams = {
  chatID: string
}

const DEFAULT_IMAGE = require('./assets/images/ms-1.jpeg')

const ChatScreen: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>()
  const { userId } = useContext(UserContext)
  const scrollViewRef = useRef<ScrollView>(null) // Create a ref for the ScrollView

  const { chatID } = route.params
  console.log('All route params:', route.params)
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState<string>('')
  const [height, setHeight] = useState(35)
  const [patientName, setPatientName] = useState<string>('')
  const [attachment, setAttachment] = useState<string | null>(null)
  const [isImageViewVisible, setIsImageViewVisible] = useState(false)
  const [currentImageURI, setCurrentImageURI] = useState<string | null>(null)

  const viewFullImage = (uri: string) => {
    setCurrentImageURI(uri)
    setIsImageViewVisible(true)
  }

  useEffect(() => {
    // Scroll to the end of the ScrollView when messages change
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false })
    }
  }, [messages])

  useEffect(() => {
    const fetchPatientName = async () => {
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
      } catch (error) {
        console.error('Error fetching patient name:', error)
      }
    }

    fetchPatientName()
  }, [chatID])

  useEffect(() => {
    const unsubscribe = listenForNewMessages(chatID, newMessage => {
      setMessages(prevMessages => [...prevMessages, newMessage])
    })

    return () => unsubscribe()
  }, [chatID])

  const showToast = (message: string) => {
    Burnt.toast({
      from: 'bottom',
      title: message,
      shouldDismissByDrag: true,
      preset: 'error',
      haptic: 'error',
      duration: 5,
    })
  }

  const handleSendMessage = async () => {
    if (message.trim() !== '' || attachment) {
      try {
        if (attachment) {
          // If there's an attachment, send it
          const messageData = {
            senderID: userId,
            text: '',
            attachmentURL: attachment, // The URL of the uploaded image
            timestamp: firebase.database.ServerValue.TIMESTAMP,
          }

          await firebase
            .database()
            .ref(`chats/${chatID}/messages`)
            .push(messageData)
          setAttachment(null) // Clear the attachment after sending
        } else {
          // Otherwise, send the text message
          const messageData = {
            senderID: userId,
            text: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
          }

          await firebase
            .database()
            .ref(`chats/${chatID}/messages`)
            .push(messageData)
        }
        setMessage('') // Clear the input after sending
      } catch (error) {
        console.error('Error sending message:', error.message)

        Burnt.toast({
          from: 'bottom',
          title: 'Failed to send message!',
          shouldDismissByDrag: true,
          preset: 'error',
          haptic: 'error',
          duration: 5,
        })
      }
    }
  }

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      if (!result.canceled && result.assets) {
        handleAddAttachment(result.assets[0].uri)
      }
    } catch (error) {
      console.error('Error picking image:', error)
    }
  }

  const handleAddAttachment = async (uri: string) => {
    try {
      const response = await fetch(uri)
      const blob = await response.blob()

      // Give the blob a name for uploading
      const timestamp = Date.now()
      blob.name = `${timestamp}.jpg`

      const downloadURL = await addChatAttachment(chatID, blob)

      // Instead of sending the image immediately, we store it in the attachment state
      setAttachment(downloadURL)
    } catch (error) {
      console.error('Image upload error:', error.message)

      Burnt.toast({
        from: 'bottom',
        title: 'Failed to upload image!',
        shouldDismissByDrag: true,
        preset: 'error',
        haptic: 'error',
        duration: 5,
      })
    }
  }

  const inputContainerHeight = 60

  const ImageModal = () => (
    <Modal
      animationType='slide'
      transparent={false}
      visible={isImageViewVisible}
      onRequestClose={() => {
        setIsImageViewVisible(false)
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={{ uri: currentImageURI }}
          style={{ width: '100%', height: '70%', resizeMode: 'contain' }}
        />
        <TouchableOpacity
          style={{ position: 'absolute', top: 50, right: 20 }}
          onPress={() => setIsImageViewVisible(false)}>
          <Ionicons name='close-circle' size={40} color='white' />
        </TouchableOpacity>
      </View>
    </Modal>
  )

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <View style={styles.container}>
        <ImageModal />
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name='arrow-back' size={24} color='white' />
          </TouchableOpacity>
          <View style={styles.leftContainer}>
            <View style={styles.userInfo}>
              <View style={styles.userImageContainer}>
                <View style={styles.userImage}>
                  <ImageBackground
                    source={DEFAULT_IMAGE}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                </View>
                <View style={styles.onlineDot} />
              </View>
              <View style={styles.nameAndStatusContainer}>
                <Text style={styles.userName}>{patientName}</Text>
              </View>
            </View>
            <View style={styles.callIconsContainer}>
              <TouchableOpacity>
                <MaterialIcons name='videocam' size={24} color='white' />
              </TouchableOpacity>
              <TouchableOpacity style={styles.voiceIcon}>
                <Ionicons name='call' size={24} color='white' />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: inputContainerHeight }}
          keyboardShouldPersistTaps='handled'>
          {messages.map((msg, index) => (
            <View key={index} style={styles.messageContainer}>
              {msg.attachmentURL ? (
                <View
                  style={
                    msg.senderID === userId
                      ? styles.outgoingImageContainer
                      : styles.incomingImageContainer
                  }>
                  <TouchableOpacity
                    onPress={() => viewFullImage(msg.attachmentURL)}>
                    <Image
                      source={{ uri: msg.attachmentURL }}
                      style={styles.chatImagePreview}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <LinearGradient
                  colors={
                    msg.senderID === userId
                      ? ['#1069ADAA', '#1069ADAA']
                      : ['#FFFFFFAA', '#FFFFFFAA']
                  }
                  style={
                    msg.senderID === userId
                      ? styles.outgoingBubble
                      : styles.incomingBubble
                  }>
                  <Text
                    style={
                      msg.senderID === userId
                        ? styles.outgoingBubbleText
                        : styles.incomingBubbleText
                    }>
                    {msg.text}
                  </Text>
                </LinearGradient>
              )}
            </View>
          ))}
        </ScrollView>

        <View style={[styles.inputContainer, { height: height + 10 }]}>
          {attachment && (
            <View style={styles.attachmentPreview}>
              <Image
                source={{ uri: attachment }}
                style={styles.attachmentImage}
              />
              <TouchableOpacity onPress={() => setAttachment(null)}>
                <Ionicons name='close-circle' size={24} color='#1069AD' />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity onPress={pickImage}>
            <MaterialCommunityIcons
              name='attachment'
              size={24}
              color='#1069AD'
            />
          </TouchableOpacity>
          <View style={styles.separator} />
          <TextInput
            style={[styles.messageInput, { height: height }]}
            value={message}
            onChangeText={setMessage}
            placeholder='Message'
            multiline={true}
            onContentSize={e => {
              setHeight(e.nativeEvent.contentSize.height)
            }}
            textAlignVertical='bottom'
          />
          <TouchableOpacity>
            <MaterialIcons name='keyboard-voice' size={24} color='#1069AD' />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}>
            <Ionicons name='send' size={24} color='#1069AD' />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4E4E4E4',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // This will ensure the arrow and the leftContainer are spaced out to the extremes.
    backgroundColor: '#1069AD',
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // This will ensure the userInfo and callIconsContainer are spaced out to the extremes.
    flex: 1, // Take up the remaining space after the arrow icon
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: -5, // Added some margin to give spacing after the avatar.
  },
  userImageContainer: {
    marginRight: 10,
    position: 'relative',
  },
  userImage: {
    marginBottom: 1,
    width: 40,
    height: 40,
    borderRadius: 20, // Half of width and height to create a circle
    overflow: 'hidden', // Ensure the image is clipped to the border-radius
  },
  nameAndStatusContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  callIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voiceIcon: {
    marginLeft: 20,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'green',
    position: 'absolute',
    bottom: 3, // Positioning it half outside of the avatar's bottom.
    right: 3, // Positioning it half outside of the avatar's right side.
  },
  chatDate: {
    fontSize: 12,
    color: 'white', // Changed to white for better contrast against the #1069AD background
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 5,
    paddingHorizontal: 10, // Horizontal padding
    paddingVertical: 5, // Vertical padding
    backgroundColor: '#1069AD', // Background color
    borderRadius: 15, // Set to half of the height (or higher) for a pill shape
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  incomingBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 2,
    marginLeft: 5,
    marginVertical: 7,
    alignSelf: 'flex-start', // Align to the left
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white
    backdropFilter: 'blur(10px)', // For the blur effect
    overflow: 'hidden', // Ensure no hue shows outside of the bubble
  },
  outgoingBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 2,
    marginRight: 5,
    marginVertical: 7,
    alignSelf: 'flex-end', // Align to the right
    backgroundColor: 'rgba(16, 105, 173, 0.9)', // Semi-transparent #1069AD
    backdropFilter: 'blur(10px)', // For the blur effect
    overflow: 'hidden', // Ensure no hue shows outside of the bubble
  },
  incomingBubbleText: {
    color: '#1069AD',
  },
  outgoingBubbleText: {
    color: 'white',
  },
  messageContainer: {
    width: '100%',
  },
  timestamp: {
    fontSize: 10,
    color: 'grey',
    marginBottom: 10, // Margin at the bottom for spacing between messages
  },
  timestampIncoming: {
    marginLeft: 5, // To align with the start of the incoming chat bubble
    alignSelf: 'flex-start',
  },
  timestampOutgoing: {
    marginRight: 5, // To align with the end of the outgoing chat bubble
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 65, // Reduced the length from the right to accommodate the send button
    backgroundColor: '#f1f1f1',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 50, // Height matches the diameter of the send button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  separator: {
    width: 1,
    height: 20, // Increase or decrease as needed
    backgroundColor: '#1069AD',
    marginHorizontal: 10,
    opacity: 0.5,
  },
  messageInput: {
    flex: 1,
    marginLeft: -5, // reduced margin to bring it closer to the separator
    paddingTop: 5,
    marginRight: 10,
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#f1f1f1',
    color: '#000',
    minHeight: 35,
  },
  outgoingImageContainer: {
    alignSelf: 'flex-end', // Align to the right
    marginRight: 5,
    marginVertical: 7,
    borderRadius: 10,
    overflow: 'hidden',
  },
  incomingImageContainer: {
    alignSelf: 'flex-start', // Align to the left
    marginLeft: 5,
    marginVertical: 7,
    borderRadius: 10,
    overflow: 'hidden',
  },
  chatImagePreview: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },
  attachmentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  attachmentImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  sendButton: {
    position: 'absolute',
    bottom: 0,
    right: -55,
    backgroundColor: 'white',
    borderRadius: 25,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})

export default ChatScreen
