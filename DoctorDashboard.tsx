import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native'
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs'
import {Ionicons} from '@expo/vector-icons'
import firebase from 'firebase/compat/app'
import {useNavigation} from '@react-navigation/native'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import ProfileTab from './ProfileTab'
import {useUser} from './UserContext'

const HomeTab = () => (
  <View style={styles.screenContainer}>
    <Text>Home Screen</Text>
  </View>
)

const AppointmentTab = () => (
  <View style={styles.screenContainer}>
    <Text>Appointment Screen</Text>
  </View>
)

const MessageTab = () => (
  <View style={styles.screenContainer}>
    <Text>Message Screen</Text>
  </View>
)

const Tab = createMaterialBottomTabNavigator()

const DoctorDashboard = ({route}) => {
  const {userFullName, setUserFullName} = useUser()
  const navigation = useNavigation()
  const [userImage, setUserImage] = useState(null) // <-- Add this state

  const getGreetingMessage = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 12) {
        return "Good Morning!";
    } else if (currentHour >= 12 && currentHour < 16) {
        return "Good Afternoon!";
    } else {
        return "Good Evening!";
    }
};

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const userUid = user.uid
        const userRef = firebase.database().ref(`users/${userUid}`)
        userRef
          .once('value')
          .then(snapshot => {
            if (snapshot.exists()) {
              const userData = snapshot.val()
              const fullName = userData.fullName
              const imageUrl = userData.profileImage || null // <-- Get the profile image URL
              setUserFullName(fullName)
              setUserImage(imageUrl) // <-- Set the profile image URL
            } else {
              console.log('User data does not exist')
            }
          })
          .catch(error => {
            console.error('Error fetching user data:', error)
          })
      } else {
        // User is signed out
      }
    })

    return () => unsubscribe()
  }, [])

  const handleProfileNavigation = () => {
    navigation.navigate('Profile')
  }

  const handleNotificationPress = () => {
    // Implement the logic for when the notification icon is pressed
  }

  const [greeting, setGreeting] = useState(getGreetingMessage());

  useEffect(() => {
    setGreeting(getGreetingMessage());
}, []);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              userImage
                ? {uri: userImage}
                : require('./assets/images/head-2.jpg')
            } // Use the defaultProfile.png image if userImage is null
            style={styles.profileImage}
          />
        </View>
        <View style={styles.textContainer}>
        <Text style={styles.headerText}>{greeting}</Text>
          <Text style={styles.subHeaderText}>{userFullName}</Text>
        </View>
        <View style={styles.notificationIconContainer}>
          <TouchableOpacity onPress={() => handleNotificationPress()}>
            <Ionicons name="ios-notifications" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
      <Tab.Navigator
        shifting={true}
        initialRouteName="Home"
        activeColor="#1069AD"
        inactiveColor="#898989"
        barStyle={{
          backgroundColor: '#fff',
          position: 'absolute',
          marginBottom: -12,
        }}>
        <Tab.Screen
          name="Home"
          component={HomeTab}
          options={{
            tabBarIcon: ({color}) => (
              <Ionicons name="ios-home" size={24} color={color} />
            ),
            tabBarLabel: 'Home',
            tabBarAccessibilityLabel: 'Home Tab',
          }}
        />
        <Tab.Screen
          name="Appointment"
          component={AppointmentTab}
          options={{
            tabBarIcon: ({color}) => (
              <Ionicons name="ios-calendar" size={24} color={color} />
            ),
            tabBarLabel: 'Appointment',
            tabBarAccessibilityLabel: 'Appointment Tab',
          }}
        />
        <Tab.Screen
          name="Message"
          component={MessageTab}
          options={{
            tabBarIcon: ({color}) => (
              <Ionicons name="ios-chatbubbles" size={24} color={color} />
            ),
            tabBarLabel: 'Message',
            tabBarAccessibilityLabel: 'Message Tab',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileTab}
          options={({route}) => ({
            tabBarIcon: ({color}) => (
              <Ionicons name="ios-person" size={24} color={color} />
            ),
            tabBarLabel: 'Profile',
            tabBarAccessibilityLabel: 'Profile Tab',
            onPress: handleProfileNavigation,
          })}
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
    borderColor: '#FFFFFF', // Color of the border, change as needed
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
