import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Animatable from 'react-native-animatable'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from '@expo/vector-icons'
import { useTheme } from 'react-native-paper'
import * as Burnt from 'burnt'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import { firebaseConfig } from './firebaseConfig'
import { loginHandle } from './Auth'

const LoginScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const [data, setData] = useState({
    username: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  })

  const [isLoading, setIsLoading] = useState(false) // Add isLoading state

  useEffect(() => {
    // Initialize Firebase using the imported configuration
    firebase.initializeApp(firebaseConfig)
  }, [])

  const textInputChange = val => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
        isValidUser: true,
      })
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
        isValidUser: false,
      })
    }
  }

  const handlePasswordChange = val => {
    if (val.trim().length >= 8) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      })
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      })
    }
  }

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    })
  }

  const handleValidUser = val => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        isValidUser: true,
      })
    } else {
      setData({
        ...data,
        isValidUser: false,
      })
    }
  }

  const handleLogin = async () => {
    if (data.username && data.password) {
      setIsLoading(true)

      try {
        const result = await loginHandle(data.username, data.password)

        if (result.success) {
          // Fetch the Firebase ID token after successful login
          const userToken = await firebase.auth().currentUser.getIdToken()

          // Fetch the user's userType from Firebase Realtime Database
          const userSnapshot = await firebase
            .database()
            .ref('users/' + firebase.auth().currentUser.uid)
            .once('value')

          const userType = userSnapshot.val().userType

          // Continue with your existing code
          console.log('Authentication successful')
          navigateByUserType(userType)
          Burnt.toast({
            title: 'Success!',
            message: 'Login Successful',
            preset: 'done',
            from: 'bottom',
            duration: 5,
          })
        } else {
          handleError(result.error)
        }
      } catch (error) {
        // Handle specific errors here
        switch (error.code) {
          case 'auth/user-not-found':
            handleError('User not found')
            break
          case 'auth/wrong-password':
            handleError('Incorrect password')
            break
          default:
            handleError('An error occurred. Please try again later.')
        }
      } finally {
        setIsLoading(false)
      }
    } else {
      Burnt.toast({
        title: '⚠️ Warning',
        message: 'Incomplete login credentials!',
        preset: 'none',
        from: 'bottom',
        duration: 5,
      })
    }
  }

  const navigateByUserType = userType => {
    if (userType === 'Doctor') {
      navigation.navigate('DocDashboard')
    } else if (userType === 'Patient') {
      navigation.navigate('PatDashboard')
    }
    // Add more conditions for other user types if needed.
  }

  const handleError = error => {
    console.error('Error:', error)

    switch (error) {
      case 'auth/email-already-in-use':
        Burnt.toast({
          title: 'Email is already in use. Please use another email address.',
          preset: 'error',
          from: 'bottom',
          haptic: 'error',
          duration: 5,
        })
        break

      case 'auth/user-not-found':
        Burnt.toast({
          title: 'Incorrect username/password combination',
          preset: 'error',
          from: 'bottom',
          haptic: 'error',
          duration: 5,
        })
        break

      default:
        Burnt.toast({
          title: 'An error occurred. Please try again later.',
          preset: 'error',
          from: 'bottom',
          haptic: 'error',
          duration: 5,
        })
        break
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#1069AD' barStyle='light-content' />
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome!</Text>
      </View>
      <Animatable.View
        animation='fadeInUpBig'
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
          },
        ]}>
        <Text style={[styles.text_footer, { color: colors.text }]}>
          Username
        </Text>
        <View style={styles.action}>
          <Feather name='user' color='black' size={20} />
          <TextInput
            placeholder='Your Username'
            placeholderTextColor='#666666'
            style={[
              styles.textInput,
              { color: colors.text, fontFamily: 'Roboto', marginTop: -5 },
            ]}
            autoCapitalize='none'
            onChangeText={val => textInputChange(val)}
            onEndEditing={e => handleValidUser(e.nativeEvent.text)}
          />
          {data.check_textInputChange ? (
            <Animatable.View animation='bounceIn'>
              <Feather name='check-circle' color='#15A00C' size={20} />
            </Animatable.View>
          ) : null}
        </View>
        {data.isValidUser ? null : (
          <Animatable.View animation='fadeInLeft' duration={500}>
            <Text style={styles.errorMsg}>
              Username must be 4 characters long.
            </Text>
          </Animatable.View>
        )}

        <Text
          style={[styles.text_footer, { color: colors.text, marginTop: 35 }]}>
          Password
        </Text>
        <View style={styles.action}>
          <Feather name='lock' color={colors.text} size={20} />
          <TextInput
            placeholder='Your Password'
            placeholderTextColor='#666666'
            secureTextEntry={data.secureTextEntry}
            style={[
              styles.textInput,
              { color: colors.text, fontFamily: 'Roboto', marginTop: -5 },
            ]}
            autoCapitalize='none'
            onChangeText={val => handlePasswordChange(val)}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name='eye-off' color='grey' size={20} />
            ) : (
              <Feather name='eye' color='grey' size={20} />
            )}
          </TouchableOpacity>
        </View>
        {data.isValidPassword ? null : (
          <Animatable.View animation='fadeInLeft' duration={500}>
            <Text style={styles.errorMsg}>
              Password must be 8 characters long.
            </Text>
          </Animatable.View>
        )}

        <TouchableOpacity>
          <Text style={{ color: '#1069AD', marginTop: 15 }}>
            Forgot password?
          </Text>
        </TouchableOpacity>
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.signIn}
            onPress={() => {
              handleLogin(data.username, data.password)
            }}>
            <LinearGradient
              colors={['#1069AD', '#0C5A97']}
              style={styles.signIn}>
              {/* Show ActivityIndicator if isLoading is true, otherwise show "Sign In" */}
              {isLoading ? (
                <ActivityIndicator color='#fff' size='small' />
              ) : (
                <Text style={[styles.textSign, { color: '#fff' }]}>
                  Sign In
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Registration')}
            style={[
              styles.signIn,
              {
                borderColor: '#1069AD',
                borderWidth: 1,
                marginTop: 15,
              },
            ]}>
            <Text style={[styles.textSign, { color: '#1069AD' }]}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1069AD',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
    paddingBottom: 25,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
    paddingTop: 5,
  },
  textInput: {
    flex: 1,
    marginTop: -13,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})

export default LoginScreen
