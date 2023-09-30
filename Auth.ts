import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import { firebaseConfig } from './firebaseConfig'
import 'firebase/compat/storage'
import { useUser } from './UserContext'

firebase.initializeApp(firebaseConfig)

export const loginHandle = async (email, password) => {
  try {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)

    if (userCredential.user) {
      const userSnapshot = await firebase
        .database()
        .ref('users/' + userCredential.user.uid)
        .once('value')
      const userType = userSnapshot.val().userType
      const userToken = await userCredential.user.getIdToken()
      return { success: true, userType, userToken }
    } else {
      throw new Error('Authentication failed')
    }
  } catch (error) {
    switch (error.code) {
      case 'auth/user-not-found':
        throw new Error('User not found')
      case 'auth/wrong-password':
        throw new Error('Incorrect password')
      default:
        throw new Error('An error occurred. Please try again later.')
    }
  }
}

export const signupHandle = async (fullName, email, password, userType) => {
  try {
    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)

    if (!userCredential.user) {
      throw new Error('User registration failed')
    }

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
    if (error.code === 'auth/email-already-in-use') {
      throw new Error(
        'Email is already in use. Please use another email address.',
      )
    } else {
      throw new Error(
        'An error occurred during registration. Please try again later.',
      )
    }
  }
}

export const addAppointment = async appointment => {
  try {
    const appointmentRef = firebase.database().ref('appointments')
    const newAppointmentRef = appointmentRef.push()
    await newAppointmentRef.set(appointment)
    return { success: true, data: newAppointmentRef.key }
  } catch (error) {
    throw new Error('Error adding appointment: ' + error.message)
  }
}

export const getAppointments = async () => {
  try {
    const appointmentRef = firebase.database().ref('appointments')
    const snapshot = await appointmentRef.once('value')

    if (snapshot.exists()) {
      const appointments = Object.values(snapshot.val())

      appointments.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time.split(' - ')[0])
        const dateB = new Date(b.date + ' ' + b.time.split(' - ')[0])
        return dateA.getTime() - dateB.getTime()
      })

      return { success: true, data: appointments }
    } else {
      throw new Error('No appointments found.')
    }
  } catch (error) {
    throw new Error('Error fetching appointments: ' + error.message)
  }
}

// Initialize a new conversation between a doctor and a patient
export const initializeConversation = async (patientID: string) => {
  const { userId: doctorID } = useUser()
  const chatID = `${doctorID}_${patientID}`
  const chatRef = firebase.database().ref(`chats/${chatID}`)
  const snapshot = await chatRef.once('value')

  if (!snapshot.exists()) {
    await chatRef.set({
      doctorID: doctorID,
      patientID: patientID,
    })
  }

  return chatID
}

// Post a message in a chat
export const postMessage = (chatID: string, text: string) => {
  const { userId: senderID } = useUser()
  const message = {
    senderID: senderID,
    text: text,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    isUnread: true, // Add the unread flag
  }

  return firebase.database().ref(`chats/${chatID}/messages`).push(message)
}

// Add an attachment for a chat and associate with a message
export const addChatAttachment = async (
  chatID: string,
  attachment: any,
): Promise<string> => {
  const storageRef = firebase.storage().ref()
  const timestamp = Date.now()
  const attachmentRef = storageRef.child(
    `chat_attachments/${chatID}/${timestamp}_${attachment.name}`,
  )

  await attachmentRef.put(attachment)
  return await attachmentRef.getDownloadURL()
}

// Fetch the latest message for a given chat
export const fetchLatestChatMessage = async (chatID: string) => {
  const messagesRef = firebase
    .database()
    .ref(`chats/${chatID}/messages`)
    .limitToLast(1)
  const snapshot = await messagesRef.once('value')
  const messages = snapshot.val()
  return messages ? messages[Object.keys(messages)[0]] : {}
}

// Listen for new messages in real-time
export const listenForNewMessages = (
  chatID: string,
  callback: (message: any) => void,
) => {
  const chatRef = firebase.database().ref(`chats/${chatID}/messages`)
  const listener = chatRef.on('child_added', snapshot => {
    callback(snapshot.val())
  })
  return () => chatRef.off('child_added', listener)
}

// Retrieve recent chats for an authenticated doctor
export const retrieveDoctorChats = async (doctorID: string) => {
  const chatsRef = firebase
    .database()
    .ref('chats')
    .orderByChild('doctorID')
    .equalTo(doctorID)
  const snapshot = await chatsRef.once('value')
  const chatData = snapshot.val()
  const chatsArray = []

  for (const chatID in chatData) {
    const lastMessage = await fetchLatestChatMessage(chatID)
    if (lastMessage) {
      chatsArray.push({
        chatID: chatID,
        lastMessage: lastMessage,
        patientID: chatData[chatID].patientID, // Add the patientID for each chat
      })
    }
  }

  return chatsArray
}
