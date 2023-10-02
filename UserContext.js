import React, { createContext, useContext, useState, useEffect } from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'

export const UserContext = createContext({})

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
  const [userId, setUserId] = useState(0)
  const [users, setUsers] = useState({}) // New state for users
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   const usersRef = firebase.database().ref('users')
  //   const handleData = snap => {
  //     if (snap.val()) {
  //       console.log('Fetched users:', snap.val())
  //       setUsers(snap.val())
  //     }
  //   }
  //   usersRef.on('value', handleData)
  //   return () => usersRef.off('value', handleData)
  // }, [])

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (
        loginTimestamp &&
        Date.now() - loginTimestamp > 30 * 24 * 60 * 60 * 1000
      ) {
        firebase.auth().signOut()
        setUserFullName('')
        setUserEmail('')
        setUserBio('')
        setUserLocation('')
        setUserImage('')
        setUserId(0)
        setLoading(false)
        return // Early return after signing out
      }

      if (user) {
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
          setUserId(userUid)
          setLoading(false)
        })
      } else {
        setUserFullName('')
        setUserEmail('')
        setUserBio('')
        setUserLocation('')
        setUserImage('')
        setUserId(0)
        setLoading(false)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [loginTimestamp])

  const value = {
    userId,
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
    users, // New users state added to context value
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export default UserContext
