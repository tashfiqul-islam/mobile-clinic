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
import { sendMessage, listenToMessages } from './Auth' // Ensure the path is correct

const ChatScreen = () => {
  const MAX_HEIGHT = 140
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([])
  const [attachment, setAttachment] = useState(null)
  const scrollViewRef = useRef(null)
  const [inputHeight, setInputHeight] = useState(35)
  const navigation = useNavigation()
  const route = useRoute()
  const conversationId = route.params.conversationId
  const [doctorId, setDoctorId] = useState(null)

  useEffect(() => {
    // Fetch doctorId based on the conversationId
    const conversationDoc = firebase
      .firestore()
      .collection('conversations')
      .doc(conversationId)
    conversationDoc.get().then(doc => {
      if (doc.exists) {
        setDoctorId(doc.data().doctorId)
      }
    })
  }, [conversationId])

  useEffect(() => {
    // Now, you can use conversationId directly
    const unsubscribe = listenToMessages(conversationId, newMessages => {
      setMessages(newMessages)

      // Add this logging statement
      console.log('Fetched Messages:', newMessages)
    })

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    )

    return () => {
      unsubscribe()
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [navigation])

  const _keyboardDidShow = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }

  const _keyboardDidHide = () => {
    // Logic if needed when keyboard hides
  }

  const handleSend = async () => {
    if (text.trim() !== '' || attachment) {
      const senderId = firebase.auth().currentUser.uid

      // If there's text, send it as a message
      if (text.trim() !== '') {
        await sendMessage(conversationId, senderId, text)
      }

      // If there's an attachment, send it as a separate message
      if (attachment) {
        await sendMessage(conversationId, senderId, '', attachment) // Pass an empty text and the image URI
        setAttachment(null) // Clear the attachment after sending
      }

      setText('')
    }
  }

  const handleVoice = () => {
    // Mock voice-to-text
    setText('This is a mock voice message.')
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
      setAttachment(selectedImageUri)

      // Optionally, you can send the attachment immediately after selecting it
      const senderId = firebase.auth().currentUser.uid
      await sendMessage(conversationId, senderId, '', selectedImageUri) // Pass an empty text and the image URI
    }
  }

  const removeAttachment = () => {
    setAttachment(null)
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
        <Text style={styles.name}>John Doe</Text>
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

      {messages.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            Send a message to start the conversation.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.chatContainer}
          ref={scrollViewRef}
          keyboardShouldPersistTaps='handled'>
          {messages.map(item => (
            <View
              key={item.id}
              style={
                item.senderId === doctorId
                  ? styles.doctorMessageContainer
                  : styles.patientMessageContainer
              }>
              <View
                style={
                  item.senderId === doctorId
                    ? styles.doctorMessageBubble
                    : styles.patientMessageBubble
                }>
                {item.attachment && (
                  <Image
                    source={{ uri: item.attachment }}
                    style={styles.attachmentImage}
                  />
                )}
                <Text
                  style={
                    item.senderId === doctorId
                      ? styles.doctorMessageText
                      : styles.patientMessageText
                  }>
                  {item.text}
                </Text>
              </View>
              <View style={styles.timestampContainer}>
                {item.senderId === doctorId && (
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
                  {item.timestamp?.toDate().toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.inputContainer}>
        {attachment && (
          <View style={styles.attachmentContainer}>
            <Image
              source={{ uri: attachment }}
              style={styles.attachmentPreview}
            />
            <TouchableOpacity
              style={styles.removeAttachment}
              onPress={removeAttachment}>
              <Ionicons
                name='ios-close-circle-outline'
                size={25}
                color='#1069AD'
              />
            </TouchableOpacity>
          </View>
        )}
        <Ionicons
          name='ios-attach-outline'
          size={30}
          color='#1069AD'
          style={styles.iconLeft}
          onPress={handleAttachment}
        />
        <TextInput
          style={[styles.input, { height: Math.min(MAX_HEIGHT, inputHeight) }]}
          placeholder='Type your message...'
          placeholderTextColor='#1069AD'
          value={text}
          onChangeText={setText}
          multiline={true}
          onContentSizeChange={e => {
            const newHeight = e.nativeEvent.contentSize.height
            setInputHeight(newHeight)
          }}
          numberOfLines={4}
        />
        <Ionicons
          name='ios-mic-outline'
          size={30}
          color='#1069AD'
          style={styles.iconRight}
          onPress={handleVoice}
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
  doctorMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  patientMessageContainer: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  doctorMessageBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    padding: 10,
    maxWidth: '70%',
    ...Platform.select({
      ios: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  patientMessageBubble: {
    backgroundColor: '#1069AD',
    borderRadius: 10,
    padding: 10,
    maxWidth: '70%',
    ...Platform.select({
      ios: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  doctorMessageText: {
    color: '#000',
    fontSize: 16,
  },
  patientMessageText: {
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
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  attachmentPreview: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  removeAttachment: {
    marginLeft: 5,
  },
  attachmentImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
})

export default ChatScreen
