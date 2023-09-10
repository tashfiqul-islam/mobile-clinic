import React, { createContext, useContext, useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [userFullName, setUserFullName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Listen for changes in the user's data (e.g., full name and email)
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, fetch and set user data
        const userUid = user.uid;
        const userRef = firebase.database().ref(`users/${userUid}`);

        userRef.on('value', (snapshot) => {
          const userData = snapshot.val();
          setUserFullName(userData.fullName || '');
          setUserEmail(userData.email || '');
        });
      } else {
        // User is signed out, clear user data
        setUserFullName('');
        setUserEmail('');
      }
    });

    return () => {
      // Clean up the subscription when the component unmounts
      unsubscribe();
    };
  }, []);

  const value = {
    userFullName,
    setUserFullName,
    userEmail,
    setUserEmail,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
