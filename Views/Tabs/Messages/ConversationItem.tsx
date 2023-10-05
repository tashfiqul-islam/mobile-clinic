import React from 'react'
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
import { AppContext } from '../../../AppContext'

export default function ConversationItem({
  conversation,
  image,
  onRead,
  patientName, // Add patientName as a prop
}) {
  const { users } = React.useContext(AppContext)

  // Using the useNavigation hook directly
  const navigation = useNavigation()

  const handleReadMessage = () => {
    if (conversation.isUnread) {
      onRead(conversation.id)
    }
    console.log('Navigating with chatID:', conversation.chatID)
    navigation.navigate('ChatScreen', { chatID: conversation.chatID })
  }

  return (
    <TouchableOpacity
      style={styles.messageContainer}
      onPress={handleReadMessage}>
      <Image source={image} style={styles.profileImage} />
      <View style={styles.messageDetails}>
        <Text style={styles.messageName}>
          {patientName || 'Unknown'} {/* Use patientName prop */}
        </Text>
        <Text style={styles.messageText}>{conversation.text}</Text>
      </View>
      <View style={styles.messageTimeContainer}>
        <Text style={styles.messageTime}>
          {new Date(conversation.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        {conversation.isUnread && <View style={styles.unreadIndicator} />}
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
