// auth.ts

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { firebaseConfig } from './firebaseConfig';
import * as Crypto from 'expo-crypto';

firebase.initializeApp(firebaseConfig);

export const loginHandle = async (email, password) => {
  try {
    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA512,
      password,
    );

    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    if (userCredential.user) {
      // Fetch the user's userType from the Firebase Realtime Database
      const userSnapshot = await firebase
        .database()
        .ref('users/' + userCredential.user.uid)
        .once('value');

      const userType = userSnapshot.val().userType;

      return { success: true, userType };
    } else {
      throw new Error('Authentication failed');
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signupHandle = async (fullName, email, password, userType) => {
  try {
    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA512,
      password,
    );

    // Create a new user in Firebase Authentication
    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    if (!userCredential.user) {
      throw new Error('User registration failed');
    }

    // Add the user's userType to the Firebase Realtime Database
    await firebase
      .database()
      .ref('users/' + userCredential.user.uid)
      .set({
        fullName: fullName,
        email: email,
        userType: userType,
        password: password,
      });

    return { success: true, userType };
  } catch (error) {
    console.error('Registration error:', error);

    if (error.code === 'auth/email-already-in-use') {
      console.log('Email is already in use.');
      throw new Error(
        'Email is already in use. Please use another email address.',
      );
    } else {
      console.error('Firebase registration error:', error);
      throw new Error(
        'An error occurred during registration. Please try again later.',
      );
    }
  }
};

// Add other authentication-related functions here (e.g., password reset, etc.)
