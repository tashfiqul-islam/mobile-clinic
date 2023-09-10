import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useTheme, Drawer } from 'react-native-paper'
import { SearchBar } from 'react-native-elements'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'

const PatientDashboard = ({ route }) => {
  const { colors } = useTheme()
  const [userFirstName, setUserFirstName] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userUid = user.uid
        const userRef = firebase.database().ref(`users/${userUid}`)
        userRef
          .once('value')
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val()
              const fullName = userData.fullName
              const firstName = fullName.split(' ')[0]
              setUserFirstName(firstName)
            } else {
              console.log('User data does not exist')
            }
          })
          .catch((error) => {
            console.error('Error fetching user data:', error)
          })
      } else {
        // User is signed out
      }
    })

    return () => unsubscribe()
  }, [])

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
          <Feather name="menu" size={24} color="white" />
        </TouchableOpacity>
        <Text style={[styles.headerText, { fontFamily: 'Roboto' }]}>
          {`Hello ${userFirstName}`}
        </Text>
      </View>
      <SearchBar
        placeholder="Search for something..."
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
        lightTheme
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
        inputStyle={styles.searchInput}
        placeholderTextColor="#888"
        searchIcon={{ size: 24 }}
      />
      {/* ... rest of your component */}
      <Drawer.Section title="Menu">
        <Drawer.Item
          label="Sign Out"
          icon={({ color, size }) => (
            <Feather name="log-out" size={size} color={color} />
          )}
          onPress={() => {
            closeDrawer()
            firebase.auth().signOut()
            navigation.navigate('Home') // Redirect to Home after signing out
          }}
        />
      </Drawer.Section>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAEAEA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1069AD',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  menuButton: {
    padding: 5,
  },
  searchContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  searchInputContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
  },
  searchInput: {
    color: '#2d3436',
  },
})

export default PatientDashboard
