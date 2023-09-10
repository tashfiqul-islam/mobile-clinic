import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './MainScreen';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';
import { firebaseConfig } from './firebaseConfig';
import ProfileTab from './ProfileTab';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { UserProvider } from './UserContext';


const Stack = createStackNavigator();

const App: React.FC = () => {
  const [initialRouteName, setInitialRouteName] = useState('Home');
  const [dashboardTitle, setDashboardTitle] = useState('Dashboard'); // Initialize with the default title

  useEffect(() => {
    // Initialize Firebase if not already initialized
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Check if the user is already authenticated
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userType = await getUserTypeFromDatabase(user.uid); // Pass user.uid
        if (userType === 'Doctor') {
          setInitialRouteName('DocDashboard');
          setDashboardTitle('Dashboard'); // Set the title based on userType
        } else if (userType === 'Patient') {
          setInitialRouteName('PatDashboard');
          setDashboardTitle('Dashboard'); // Set the title based on userType
        }
      } else {
        setInitialRouteName('Home');
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const getUserTypeFromDatabase = async (userId) => {
    try {
      // Reference to the current user's data in the Firebase Realtime Database
      const userRef = firebase.database().ref(`users/${userId}`);

      // Fetch the user data
      const snapshot = await userRef.once('value');
      const userData = snapshot.val();

      if (userData && userData.userType) {
        // If the user data and userType exist, return the userType
        return userData.userType;
      } else {
        // Handle the case where userType is not available
        console.error('UserType not found in database');
        return null; // You can return a default value or handle this case differently
      }
    } catch (error) {
      // Handle any errors that occur during the database fetch
      console.error('Error fetching userType from database:', error);
      return null; // Handle errors gracefully
    }
  };

  return (
    <UserProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen
          name="Home"
          component={MainScreen}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="Registration"
          component={SignUpScreen}
          options={{ title: 'Registration' }}
        />
        <Stack.Screen
          name="DocDashboard"
          component={DoctorDashboard}
          options={{ title: dashboardTitle, headerShown: false }} // Hide the header for this screen
        />
        <Stack.Screen
          name="PatDashboard"
          component={PatientDashboard}
          options={{ title: dashboardTitle, headerShown: false }} // Hide the header for this screen
        />
        <Stack.Screen
          name="Profile"
          component={ProfileTab}
          options={{ title: 'Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </UserProvider>
  );
};

export default App;
