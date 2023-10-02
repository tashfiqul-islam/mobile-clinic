import 'react-native-gesture-handler'
import React, { useEffect, useState, useRef } from 'react'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { firebaseConfig } from './firebaseConfig'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import { UserProvider } from './UserContext'
import { AppContext } from './AppContext'

import 'react-native-gesture-handler'
import { NavigationContext } from './NavigationContext'
import MainScreen from './MainScreen'
import LoginScreen from './LoginScreen'
import SignUpScreen from './SignUpScreen'
// import DoctorDashboard from './DoctorDashboard'
import PatientDashboard from './PatientDashboard'
import AppointmentOverview from './AppointmentOverview'
import AuthProvider from './AuthCheck'
import ProfileTab from './ProfileTab'
import DoctorDashboardNavigator from './DoctorDashboardNavigator'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AuthCheck from './AuthCheck'

const Stack = createStackNavigator()

const App: React.FC = () => {
  const [dashboardTitle, setDashboardTitle] = useState('Dashboard')
  const [isAppReady, setAppReady] = useState(false)
  const [initialRouteName, setInitialRouteName] = useState('Home')
  const mainNavigationRef = useRef(null)

  const [allUsers, setAllUsers] = useState([])
  const [isUsersLoaded, setUsersLoaded] = useState(false)
  const [currentNavigation, setCurrentNavigation] = useState('main')

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
            // If the user is not authenticated, navigate to the home/login screen.
            setInitialRouteName('Home')
            // If you have set up a ref to your NavigationContainer:
            mainNavigationRef.current?.navigate('Home')
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
    <AppContext.Provider
      value={{
        users: allUsers,
        setUsers: setAllUsers,
        isUsersLoaded,
        setUsersLoaded,
      }}>
      <UserProvider>
        <NavigationContext.Provider value={{ navigator: mainNavigationRef }}>
          <NavigationContainer ref={mainNavigationRef}>
            <Stack.Navigator initialRouteName={initialRouteName}>
              <Stack.Screen
                name='Home'
                component={MainScreen}
                options={{ title: 'Home' }}
              />
              <Stack.Screen
                name='DocDashboard'
                options={{ title: dashboardTitle, headerShown: false }}>
                {(...props) => {
                  return (
                    <AuthCheck RenderComponent={DoctorDashboardNavigator} />
                  )
                }}
              </Stack.Screen>
              <Stack.Screen
                name='PatDashboard'
                component={PatientDashboard}
                options={{ title: dashboardTitle, headerShown: false }}
              />
              <Stack.Screen name='Profile' options={{ title: 'Profile' }}>
                {(...props) => {
                  return <AuthCheck RenderComponent={ProfileTab} />
                }}
              </Stack.Screen>
              <Stack.Screen
                name='AppointmentOverview'
                component={AppointmentOverview}
                options={{ title: 'Appointment Overview' }}
              />

              <Stack.Screen
                name='Login'
                component={LoginScreen}
                options={{ title: 'Login' }}
              />
              <Stack.Screen
                name='Registration'
                component={SignUpScreen}
                options={{ title: 'Registration' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </NavigationContext.Provider>
      </UserProvider>
    </AppContext.Provider>
  )
}

export default App
