import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import 'firebase/compat/firestore'
import { firebaseConfig } from './firebaseConfig'

firebase.initializeApp(firebaseConfig)

// User Login

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

      // Fetch the Firebase ID token
      const userToken = await userCredential.user.getIdToken()

      return { success: true, userType, userToken }
    } else {
      return { success: false, error: 'Authentication failed' }
    }
  } catch (error) {
    // Handle specific errors here
    switch (error.code) {
      case 'auth/user-not-found':
        return { success: false, error: 'User not found' }
      case 'auth/wrong-password':
        return { success: false, error: 'Incorrect password' }
      // ... handle other specific error codes
      default:
        return {
          success: false,
          error: 'An error occurred. Please try again later.',
        }
    }
  }
}

// User Signup

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

    return { success: true, userType }
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

// Get appointment info

export const addAppointment = async appointment => {
  try {
    const appointmentRef = firebase.database().ref('appointments')
    const newAppointmentRef = appointmentRef.push()
    await newAppointmentRef.set(appointment)
    return { success: true, data: newAppointmentRef.key }
  } catch (error) {
    console.error('Error adding appointment:', error)
    return {
      success: false,
      error: error.message || 'Unable to add appointment.',
    }
  }
}

// Add appointment info
interface Appointment {
  name: string
  type: string
  date: string
  time: string
  image: string
  rating: number
  reviews: number
}

export const getAppointments = async () => {
  try {
    const appointmentRef = firebase.database().ref('appointments')
    const snapshot = await appointmentRef.once('value')

    if (snapshot.exists()) {
      const appointments = Object.values(snapshot.val()) as Appointment[]

      // Sort appointments by date and time
      appointments.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time.split(' - ')[0])
        const dateB = new Date(b.date + ' ' + b.time.split(' - ')[0])
        return dateA.getTime() - dateB.getTime() // Use getTime() to get the time in milliseconds
      })

      return { success: true, data: appointments }
    } else {
      throw new Error('No appointments found.')
    }
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return {
      success: false,
      error: error.message || 'Unable to fetch appointments.',
    }
  }
}

// Messaging Functions

export const startConversation = async (doctorId, patientId) => {
  const db = firebase.firestore()
  const conversationRef = db.collection('conversations')

  // Check if a conversation already exists between these two users
  const existingConvo = await conversationRef
    .where('doctorId', '==', doctorId)
    .where('patientId', '==', patientId)
    .limit(1)
    .get()

  if (!existingConvo.empty) {
    // Return the existing conversation's ID
    return existingConvo.docs[0].id
  }

  // If no existing conversation is found, create a new one
  const newConvoRef = await conversationRef.add({
    doctorId,
    patientId,
    lastMessage: '',
    lastMessageTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
  })

  return newConvoRef.id
}

export const sendMessage = async (conversationId, senderId, content) => {
  const db = firebase.firestore()

  // Add a new message to the messages sub-collection
  const messageRef = db
    .collection('conversations')
    .doc(conversationId)
    .collection('messages')
  await messageRef.add({
    senderId,
    content,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  })

  // Update the last message and timestamp in the conversation document
  await db.collection('conversations').doc(conversationId).update({
    lastMessage: content,
    lastMessageTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
  })
}

export const listenToMessages = (conversationId, callback) => {
  const db = firebase.firestore()

  const messagesRef = db
    .collection('conversations')
    .doc(conversationId)
    .collection('messages')
    .orderBy('timestamp', 'asc')

  // Set up a real-time listener
  const unsubscribe = messagesRef.onSnapshot(snapshot => {
    let messages = []
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        messages.push(change.doc.data())
      }
    })
    callback(messages)
  })

  // Return the unsubscribe function to allow stopping the listener later
  return unsubscribe
}

export const listenToConversations = (doctorId, callback) => {
  const db = firebase.firestore()

  const unsubscribe = db
    .collection('conversations')
    .where('doctorId', '==', doctorId)
    .onSnapshot(snapshot => {
      const conversations = []
      snapshot.forEach(doc => {
        const data = doc.data()
        conversations.push({
          id: doc.id,
          ...data,
        })
      })
      callback(conversations)
    })

  return unsubscribe
}
