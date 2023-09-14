import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import {firebaseConfig} from './firebaseConfig'

firebase.initializeApp(firebaseConfig)

export const loginHandle = async (email, password) => {
  try {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)

    if (userCredential.user) {
      // Fetch the user's userType from the Firebase Realtime Database
      const userSnapshot = await firebase
        .database()
        .ref('users/' + userCredential.user.uid)
        .once('value')

      const userType = userSnapshot.val().userType

      return {success: true, userType}
    } else {
      return {success: false, error: 'Authentication failed'}
    }
  } catch (error) {
    // Handle specific errors here
    switch (error.code) {
      case 'auth/user-not-found':
        return {success: false, error: 'User not found'}
      case 'auth/wrong-password':
        return {success: false, error: 'Incorrect password'}
      // ... handle other specific error codes
      default:
        return {
          success: false,
          error: 'An error occurred. Please try again later.',
        }
    }
  }
}

export const signupHandle = async (fullName, email, password, userType) => {
  try {
    // Create a new user in Firebase Authentication
    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)

    if (!userCredential.user) {
      throw new Error('User registration failed')
    }

    // Add the user's userType to the Firebase Realtime Database
    await firebase
      .database()
      .ref('users/' + userCredential.user.uid)
      .set({
        fullName: fullName,
        email: email,
        userType: userType,
        userBio: '',
      })

    return {success: true, userType}
  } catch (error) {
    console.error('Registration error:', error)

    if (error.code === 'auth/email-already-in-use') {
      console.log('Email is already in use.')
      throw new Error(
        'Email is already in use. Please use another email address.',
      )
    } else {
      console.error('Firebase registration error:', error)
      throw new Error(
        'An error occurred during registration. Please try again later.',
      )
    }
  }
}

// Add other authentication-related functions here (e.g., password reset, etc.)
