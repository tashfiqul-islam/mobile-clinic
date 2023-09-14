import React, {useState, useEffect, useRef} from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native'

const primaryColor = '#1069AD'
const secondaryColor = '#0B4F6C'
const windowWidth = Dimensions.get('window').width

const dummyData = [
  {
    id: '1',
    name: 'John Doe',
    message:
      'Patient John Doe: I have been experiencing mild headaches for the past two days.',
    time: '12:45 PM',
    avatar: 'https://via.placeholder.com/50',
    read: true,
    online: true,
  },
  {
    id: '2',
    name: 'Alice Smith',
    message:
      'Patient Alice Smith: My blood pressure readings have been quite high lately.',
    time: '11:30 AM',
    avatar: 'https://via.placeholder.com/50',
    read: false,
    online: false,
  },
  {
    id: '3',
    name: 'Bob Johnson',
    message: 'Patient Bob Johnson: I need a refill for my asthma medication.',
    time: '10:15 AM',
    avatar: 'https://via.placeholder.com/50',
    read: true,
    online: true,
  },
  {
    id: '4',
    name: 'Charlie Brown',
    message:
      'Patient Charlie Brown: Can we reschedule my upcoming appointment?',
    time: '09:10 AM',
    avatar: 'https://via.placeholder.com/50',
    read: false,
    online: true,
  },
  {
    id: '5',
    name: 'David Williams',
    message:
      'Patient David Williams: Thank you for the medical advice on our last visit!',
    time: '08:00 AM',
    avatar: 'https://via.placeholder.com/50',
    read: true,
    online: true,
  },
]

const MessageItem = ({item}) => {
  const scaleValue = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.messageItemContainer}>
      <Animated.View
        style={{flexDirection: 'row', transform: [{scale: scaleValue}]}}>
        <View style={styles.avatarContainer}>
          <Image style={styles.avatar} source={{uri: item.avatar}} />
          <View
            style={
              item.online ? styles.onlineIndicator : styles.offlineIndicator
            }
          />
        </View>
        <View style={styles.messageContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
        <View style={styles.messageInfo}>
          {!item.read && <View style={styles.unreadIndicator} />}
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  )
}

const MessageTab = () => {
  const [activeTab, setActiveTab] = useState(
    dummyData.some(data => !data.read) ? 'Unread' : 'Read',
  )
  const unreadMessages = dummyData.filter(data => !data.read)
  const readMessages = dummyData.filter(data => data.read)
  const indicatorPosition = useRef(
    new Animated.Value(activeTab === 'Unread' ? 0 : windowWidth / 2),
  ).current

  const switchTab = tabName => {
    setActiveTab(tabName)
    Animated.spring(indicatorPosition, {
      toValue: tabName === 'Unread' ? 0 : windowWidth / 2,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }).start()
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => switchTab('Unread')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Unread' && {color: primaryColor},
            ]}>
            Unread
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => switchTab('Read')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Read' && {color: primaryColor},
            ]}>
            Read
          </Text>
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.indicator,
            {transform: [{translateX: indicatorPosition}]},
          ]}
        />
      </View>
      <FlatList
        data={activeTab === 'Unread' ? unreadMessages : readMessages}
        renderItem={({item}) => <MessageItem item={item} />}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Looks like you're all caught up!</Text>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
    elevation: 5,
  },
  tab: {
    flex: 1,
    padding: 15,
  },
  tabText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#aaa',
  },
  indicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    width: windowWidth / 2,
    height: 2,
    backgroundColor: primaryColor,
  },
  messageItemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 2,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 12,
  },
  avatarContainer: {
    marginRight: 10,
    borderColor: primaryColor,
    borderWidth: 1,
    borderRadius: 26,
    padding: 1,
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    position: 'absolute',
    bottom: 0,
    right: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  offlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    position: 'absolute',
    bottom: 0,
    right: 3,
    borderWidth: 2,
    borderColor: 'white',
  },
  messageContent: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  messageText: {
    color: '#777',
  },
  messageInfo: {
    alignItems: 'flex-end',
  },
  unreadIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: primaryColor,
    marginRight: 5,
  },
  timeText: {
    color: '#aaa',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#aaa',
    fontSize: 18,
  },
})

export default MessageTab
