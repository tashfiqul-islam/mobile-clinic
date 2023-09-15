import React, {useEffect, useState} from 'react'
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'

const DEFAULT_IMAGE_URL =
  'https://firebasestorage.googleapis.com/v0/b/mclinic-df2b5.appspot.com/o/profile_images%2FdefaultProfile.png?alt=media&token=600ebca7-a028-428c-9199-3bd7464cf216'

const CustomHeader = ({userImage, userFullName}) => {
  const navigation = useNavigation()
  const [greeting, setGreeting] = useState('')

  const getGreetingMessage = () => {
    const currentHour = new Date().getHours()
    if (currentHour >= 0 && currentHour < 12) {
      return 'Good Morning!'
    } else if (currentHour >= 12 && currentHour < 16) {
      return 'Good Afternoon!'
    } else {
      return 'Good Evening!'
    }
  }

  useEffect(() => {
    setGreeting(getGreetingMessage())
  }, [])

  const handleProfileNavigation = () => {
    navigation.navigate('Profile')
  }

  const handleNotificationPress = () => {
    // Implement the logic for when the notification icon is pressed
  }

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.profileImageContainer}
        onPress={handleProfileNavigation}>
        <Image
          source={{uri: userImage || DEFAULT_IMAGE_URL}}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.headerText}>{greeting}</Text>
        <Text style={styles.subHeaderText}>{userFullName}</Text>
      </View>
      <TouchableOpacity
        style={styles.notificationIconContainer}
        onPress={handleNotificationPress}>
        <Ionicons name="ios-notifications" size={24} color="white" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1069AD',
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 4, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: {width: 0, height: 2}, // for iOS shadow
    shadowOpacity: 0.25, // for iOS shadow
    shadowRadius: 3.84, // for iOS shadow
  },
  profileImageContainer: {
    width: 55,
    height: 55,
    backgroundColor: 'white',
    borderRadius: 60,
    overflow: 'hidden',
    marginRight: 10,
  },
  profileImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1, // to take up all available space between the image and the notification icon
  },
  headerText: {
    color: '#D1D1D1',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  subHeaderText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  notificationIconContainer: {
    paddingLeft: 10,
  },
})

export default CustomHeader
