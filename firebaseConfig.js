import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import {useEffect} from 'react'

// Initialize Firebase
export const firebaseConfig = {
  apiKey: 'AIzaSyD3o3KYS5fAgkhC93-6moz2IPnbOFpuWeo',
  authDomain: 'mclinic-df2b5.firebaseapp.com',
  databaseURL:
    'https://mclinic-df2b5-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'mclinic-df2b5',
  storageBucket: 'mclinic-df2b5.appspot.com',
  messagingSenderId: '469820537224',
  appId: '1:469820537224:android:78c9d971bd803ea4ebe23d',
}

function FirebaseInitializer() {
  useEffect(() => {
    // Initialize Firebase using the imported configuration
    firebase.initializeApp(firebaseConfig)
  }, [])

  // You can render something here if needed
  return null
}

export default FirebaseInitializer
