import 'react-native-gesture-handler'
import React, {useEffect, useState, useRef} from 'react'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import MainScreen from './MainScreen'
import LoginScreen from './LoginScreen'
import SignUpScreen from './SignUpScreen'
import DoctorDashboard from './DoctorDashboard'
import PatientDashboard from './PatientDashboard'
import AppointmentOverview from './AppointmentOverview'
import {firebaseConfig} from './firebaseConfig'
import ProfileTab from './ProfileTab'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import {UserProvider} from './UserContext'

const Stack = createStackNavigator()

const App: React.FC = () => {
  const [initialRouteName, setInitialRouteName] = useState('Home')
  const [dashboardTitle, setDashboardTitle] = useState('Dashboard')
  const [isAppReady, setAppReady] = useState(false)
  const navigationRef = useRef(null)

  useEffect(() => {
    async function prepareApp() {
      try {
        await SplashScreen.preventAutoHideAsync()
        await loadFonts()
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig)
        }
        const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
          if (user) {
            const userType = await getUserTypeFromDatabase(user.uid)
            if (userType === 'Doctor') {
              setInitialRouteName('DocDashboard')
              setDashboardTitle('Doctor Dashboard')
            } else if (userType === 'Patient') {
              setInitialRouteName('PatDashboard')
              setDashboardTitle('Patient Dashboard')
            }
          } else {
            setInitialRouteName('Home')
          }
        })
        setAppReady(true)
        return () => unsubscribe()
      } catch (error) {
        console.warn(error)
      }
    }

    prepareApp()
  }, [])

  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hideAsync()
    }
  }, [isAppReady])

  const getUserTypeFromDatabase = async userId => {
    try {
      const userRef = firebase.database().ref(`users/${userId}`)
      const snapshot = await userRef.once('value')
      const userData = snapshot.val()

      if (userData && userData.userType) {
        return userData.userType
      } else {
        console.error('UserType not found in database')
        return null
      }
    } catch (error) {
      console.error('Error fetching userType from database:', error)
      return null
    }
  }

  const loadFonts = async () => {
    await Font.loadAsync({
      'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
      'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
    })
  }

  if (!isAppReady) {
    return null
  }

  return (
    <UserProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName={initialRouteName}>
          <Stack.Screen
            name="Home"
            component={MainScreen}
            options={{title: 'Home'}}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{title: 'Login'}}
          />
          <Stack.Screen
            name="Registration"
            component={SignUpScreen}
            options={{title: 'Registration'}}
          />
          <Stack.Screen
            name="DocDashboard"
            component={DoctorDashboard}
            options={{title: dashboardTitle, headerShown: false}}
          />
          <Stack.Screen
            name="PatDashboard"
            component={PatientDashboard}
            options={{title: dashboardTitle, headerShown: false}}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileTab}
            options={{title: 'Profile'}}
          />
          <Stack.Screen
            name="AppointmentOverview"
            component={AppointmentOverview}
            options={{title: 'Appointment Overview'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  )
}

export default App
