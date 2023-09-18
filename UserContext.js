import React, { createContext, useContext, useState, useEffect } from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import * as ImagePicker from 'expo-image-picker'

const UserContext = createContext()

export const useUser = () => {
  return useContext(UserContext)
}

export const UserProvider = ({ children }) => {
  const [userFullName, setUserFullName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userBio, setUserBio] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [userLocation, setUserLocation] = useState('')
  const [userImage, setUserImage] = useState('')

  useEffect(() => {
    // Listen for changes in the user's data (e.g., full name and email)
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in, fetch and set user data
        const userUid = user.uid
        const userRef = firebase.database().ref(`users/${userUid}`)

        userRef.on('value', snapshot => {
          const userData = snapshot.val()
          setUserFullName(userData.fullName || '')
          setUserEmail(userData.email || '')
          setUserBio(userData.userBio || '')
          setUserLocation(userData.location || '')
          setUserImage(userData.profileImage || '')
        })
      } else {
        // User is signed out, clear user data
        setUserFullName('')
        setUserEmail('')
        setUserImage('')
      }
    })

    return () => {
      // Clean up the subscription when the component unmounts
      unsubscribe()
    }
  }, [])

  const value = {
    userFullName,
    setUserFullName,
    userEmail,
    setUserEmail,
    userBio,
    setUserBio,
    userPassword,
    setUserPassword,
    userLocation,
    setUserLocation,
    userImage,
    setUserImage,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export default UserContext
