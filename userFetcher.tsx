import firebase from 'firebase/compat'
import { useEffect } from 'react'
import { UserProvider } from './UserContext'

export const UserFetcher = () => {
  useEffect(() => {
    const usersRef = firebase.database().ref('users')
    const handleData = snap => {
      if (snap.val()) {
        console.log('Fetched users:', snap.val())
        setUsers(snap.val())
      }
    }
    usersRef.on('value', handleData)
    return () => usersRef.off('value', handleData)
  }, [])
  return null
}
