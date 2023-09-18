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
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

const dummyData = [
  {
    id: '1',
    user: 'Doctor',
    message: 'Hello! How can I assist you today?',
    timestamp: '10:15 AM',
    status: 'delivered',
  },
  {
    id: '2',
    user: 'Patient',
    message: 'I have been feeling dizzy lately.',
    timestamp: '10:16 AM',
  },
  {
    id: '3',
    user: 'Doctor',
    message: 'How long have you been feeling this way?',
    timestamp: '10:17 AM',
    status: 'delivered',
  },
  {
    id: '4',
    user: 'Patient',
    message: 'For about a week now.',
    timestamp: '10:18 AM',
  },
  {
    id: '5',
    user: 'Doctor',
    message: 'Any other symptoms?',
    timestamp: '10:20 AM',
    status: 'delivered',
  },
  {
    id: '6',
    user: 'Patient',
    message: 'Occasional headaches.',
    timestamp: '10:22 AM',
  },
  {
    id: '7',
    user: 'Doctor',
    message: 'I recommend seeing a specialist.',
    timestamp: '10:25 AM',
    status: 'sent',
  },
  {
    id: '8',
    user: 'Patient',
    message: 'Thank you, doctor.',
    timestamp: '10:26 AM',
  },
]

const ChatScreen = () => {
  const MAX_HEIGHT = 140
  const [text, setText] = useState('')
  const [messages, setMessages] = useState(dummyData)
  const [attachment, setAttachment] = useState(null)
  const scrollViewRef = useRef(null)
  const [inputHeight, setInputHeight] = useState(35)

  const handleSend = () => {
    if (text.trim() !== '' || attachment) {
      const newMessage = {
        id: Date.now().toString(),
        user: 'Doctor',
        message: text,
        timestamp: 'Just now',
        status: 'sent',
      }

      if (attachment) {
        newMessage.attachment = attachment
      }

      setMessages([...messages, newMessage])
      setText('')
      setAttachment(null)

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
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
    }
  }

  const removeAttachment = () => {
    setAttachment(null)
  }

  const navigation = useNavigation()

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    )

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  const _keyboardDidShow = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }

  const _keyboardDidHide = () => {
    // Logic if needed when keyboard hides
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

      <ScrollView
        style={styles.chatContainer}
        ref={scrollViewRef}
        keyboardShouldPersistTaps='handled'>
        {messages.map(item => (
          <View
            key={item.id}
            style={
              item.user === 'Doctor'
                ? styles.doctorMessageContainer
                : styles.patientMessageContainer
            }>
            <View
              style={
                item.user === 'Doctor'
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
                  item.user === 'Doctor'
                    ? styles.doctorMessageText
                    : styles.patientMessageText
                }>
                {item.message}
              </Text>
            </View>
            <View style={styles.timestampContainer}>
              {item.user === 'Doctor' && (
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
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

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
          style={[styles.input, { height: Math.min(MAX_HEIGHT, inputHeight) }]} // Don't allow the height to exceed MAX_HEIGHT.
          placeholder='Type your message...'
          placeholderTextColor='#1069AD'
          value={text}
          onChangeText={setText}
          multiline={true}
          onContentSize={e => {
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
    backgroundColor: '#E4E4E4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomColor: '#D1D1D1',
    borderBottomWidth: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Transparent white for frosted effect
    borderRadius: 15,
    padding: 5,
    ...Platform.select({
      ios: {
        backdropFilter: 'blur(10px)', // Actual glass effect on iOS
      },
    }),
    marginRight: 5,
  },
  statusText: {
    marginLeft: 5,
    color: 'black',
  },
  attachmentImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  onlineIcon: {
    color: 'green',
    marginRight: 5,
  },
  iconLeft: {
    marginLeft: 5, // 5px less than the original 10px
  },
  iconRight: {
    marginLeft: 10,
  },
  name: {
    flex: 1,
    color: '#1069AD',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10, // Adjusted for pill shape
    paddingVertical: 2, // Reduced padding
    paddingHorizontal: 7,
    ...Platform.select({
      ios: {
        backdropFilter: 'blur(10px)',
      },
    }),
    marginRight: 5,
  },
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  attachmentPreview: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  removeAttachment: {
    marginLeft: 5,
  },
  status: {
    color: '#1069AD',
    marginRight: 10,
  },
  chatContainer: {
    flex: 1,
    padding: 10,
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Transparent white
    borderRadius: 10,
    padding: 10,
    maxWidth: '70%',
    ...Platform.select({
      ios: {
        backdropFilter: 'blur(10px)', // Actual glass effect on iOS
      },
    }),
  },
  patientMessageBubble: {
    backgroundColor: '#1069AD', // Primary color
    borderRadius: 10,
    padding: 10,
    maxWidth: '70%',
    ...Platform.select({
      ios: {
        backdropFilter: 'blur(10px)', // Actual glass effect on iOS
      },
    }),
  },
  doctorMessageText: {
    color: '#000', // Black text
    fontSize: 16,
  },
  patientMessageText: {
    color: '#FFF', // White text
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
    backgroundColor: '#E4E4E4', // Keeping the original background color for the bottom bar
  },
  input: {
    flex: 1,
    color: '#1069AD',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Transparent white for frosted effect
    ...Platform.select({
      ios: {
        backdropFilter: 'blur(10px)', // Actual glass effect on iOS
      },
    }),
    marginHorizontal: 5,
  },
})

export default ChatScreen
