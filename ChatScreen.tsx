import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
} from '@expo/vector-icons'
import LinearGradient from 'react-native-linear-gradient'

const ChatScreen: React.FC = () => {
  const [message, setMessage] = useState<string>('')
  const [height, setHeight] = useState(35) // initial height

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name='arrow-back' size={24} color='#1069AD' />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>John Doe</Text>
          <View style={styles.statusContainer}>
            <View style={styles.onlineDot} />
            <Text style={styles.userStatus}>Online</Text>
          </View>
        </View>
        <TouchableOpacity>
          <MaterialIcons name='videocam' size={24} color='#1069AD' />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name='call' size={24} color='#1069AD' />
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={['#FFB6C1', '#FFDAB9', '#E6E6FA']}
        style={styles.chatBubble}>
        <Text>Hey there!</Text>
      </LinearGradient>
      <LinearGradient
        colors={['#E6E6FA', '#FFDAB9', '#FFB6C1']}
        style={styles.chatBubble}>
        <Text>Hello! How are you?</Text>
      </LinearGradient>

      <View style={[styles.inputContainer, { height: height + 10 }]}>
        <TouchableOpacity>
          <MaterialCommunityIcons name='attachment' size={24} color='#1069AD' />
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
      </View>
      <TouchableOpacity style={styles.sendButton}>
        <Ionicons name='send' size={24} color='#1069AD' />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#E4E4E4E4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1069AD',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'green',
    marginRight: 5,
  },
  userStatus: {
    fontSize: 12,
    color: 'grey',
  },
  chatBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 20,
    marginVertical: 10,
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
  },
  messageInput: {
    flex: 1,
    marginLeft: -5, // reduced margin to bring it closer to the separator
    marginRight: 10,
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#f1f1f1',
    color: '#fff',
    minHeight: 35,
  },
  sendButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
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
