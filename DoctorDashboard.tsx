import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import firebase from 'firebase/compat/app'
import { useNavigation } from '@react-navigation/native'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import ProfileTab from './ProfileTab'
import HomeTab from './HomeTab'
import AppointmentList from './AppointmentList'
import MessageTab from './MessageTab'
import { useUser } from './UserContext'

const CustomTabLabel = ({ title, focused }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: focused ? 5 : 0,
      }}>
      {focused ? <Text style={{ color: '#1069AD' }}>{title}</Text> : null}
    </View>
  )
}

const renderIcon = (name, color, size) => {
  const circleDiameter = 48
  const iconSize = 28
  const isFocused = color === '#1069AD'

  const inactiveOffset = (circleDiameter - iconSize) / 2

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: isFocused ? 10 : 0,
        marginTop: isFocused ? 0 : inactiveOffset,
      }}>
      <View
        style={{
          width: circleDiameter,
          height: circleDiameter,
          borderRadius: circleDiameter / 2,
          backgroundColor: isFocused ? '#1069AD' : 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: isFocused ? 5 : -5,
        }}>
        <Ionicons
          name={name}
          size={iconSize}
          color={isFocused ? 'white' : color}
          style={{ marginTop: isFocused ? -2 : 15 }}
        />
      </View>
    </View>
  )
}

const DEFAULT_IMAGE_URL =
  'https://firebasestorage.googleapis.com/v0/b/mclinic-df2b5.appspot.com/o/profile_images%2FdefaultProfile.png?alt=media&token=600ebca7-a028-428c-9199-3bd7464cf216'

const Tab = createBottomTabNavigator()

const DoctorDashboard = ({ route }) => {
  const { userFullName, setUserFullName } = useUser()
  const navigation = useNavigation()
  const [userImage, setUserImage] = useState(null) // <-- Add this state

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
    const user = firebase.auth().currentUser

    if (user) {
      const userUid = user.uid
      const userRef = firebase.database().ref(`users/${userUid}/profileImage`) // path to profile image

      // Firebase listener
      const handleDataChange = snapshot => {
        if (snapshot.exists()) {
          setUserImage(snapshot.val()) // Update the local state
        }
      }

      userRef.on('value', handleDataChange)

      // Return a cleanup function to detach the listener when the component unmounts
      return () => {
        userRef.off('value', handleDataChange)
      }
    }
  }, []) // Empty dependency array means this effect runs once when the component mounts

  const handleProfileNavigation = () => {
    navigation.navigate('Profile')
  }

  const handleHomeNavigation = () => {
    navigation.navigate('Home')
  }

  const handleAppointmentNavigation = () => {
    navigation.navigate('AppointmentList')
  }

  const handleNotificationPress = () => {
    // Implement the logic for when the notification icon is pressed
  }

  const [greeting, setGreeting] = useState(getGreetingMessage())

  useEffect(() => {
    setGreeting(getGreetingMessage())
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={handleProfileNavigation}>
          <Image
            source={{ uri: userImage || DEFAULT_IMAGE_URL }}
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
          <Ionicons name='ios-notifications' size={24} color='white' />
        </TouchableOpacity>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#1069AD',
          tabBarInactiveTintColor: '#898989',
          tabBarStyle: {
            position: 'absolute',
            bottom: 7.5,
            left: 7.5,
            right: 7.5,
            backgroundColor: '#fff',
            height: 60,
            borderRadius: 8,
            elevation: 8,
            alignItems: 'center', // Center icons and labels vertically
          },
          tabBarIconStyle: {
            height: 30,
          },
          tabBarLabelStyle: {
            paddingTop: 20, // Increase this value to move the label up
          },
          headerShown: false,
        }}>
        <Tab.Screen
          name='Home'
          component={HomeTab}
          options={{
            tabBarIcon: ({ color, size }) =>
              renderIcon('ios-home', color, size),
            tabBarLabel: ({ focused }) => (
              <CustomTabLabel title='Home' focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name='AppointmentList'
          component={AppointmentList}
          options={{
            tabBarIcon: ({ color, size }) =>
              renderIcon('ios-calendar', color, size),
            tabBarLabel: ({ focused }) => (
              <CustomTabLabel title='Appointment' focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name='Message'
          component={MessageTab}
          options={{
            tabBarIcon: ({ color, size }) =>
              renderIcon('ios-chatbubbles', color, size),
            tabBarLabel: ({ focused }) => (
              <CustomTabLabel title='Message' focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name='Profile'
          component={ProfileTab}
          options={{
            tabBarIcon: ({ color, size }) =>
              renderIcon('ios-person', color, size),
            tabBarLabel: ({ focused }) => (
              <CustomTabLabel title='Profile' focused={focused} />
            ),
            tabBarItemStyle: {
              borderRightWidth: 0,
            },
          }}
        />
      </Tab.Navigator>
    </View>
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
    backgroundColor: '#1069AD',
    paddingVertical: 10,
    paddingHorizontal: 10,
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
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
  },
})

export default DoctorDashboard
