import React, { createContext, useContext, useState, useEffect } from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'

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
  const [loginTimestamp, setLoginTimestamp] = useState(null)

  useEffect(() => {
    // Listen for changes in the user's data (e.g., full name and email)
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      // Check elapsed time since the saved timestamp and log out if more than a month
      if (
        loginTimestamp &&
        Date.now() - loginTimestamp > 30 * 24 * 60 * 60 * 1000
      ) {
        // 30 days in milliseconds
        firebase.auth().signOut()
      }

      if (user) {
        // User is signed in, fetch and set user data
        // Setting the login timestamp
        if (!loginTimestamp) {
          setLoginTimestamp(Date.now())
        }

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
