import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native'
import * as Animatable from 'react-native-animatable'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather, FontAwesome } from '@expo/vector-icons'
import { Dropdown } from 'react-native-element-dropdown'
import * as Burnt from 'burnt'
import Footer from './Footer'
import * as Crypto from 'expo-crypto'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import { signupHandle } from './Auth'
import auth from '@react-native-firebase/auth'

const UserTypeData = [
  { label: 'Doctor', value: 'Doctor' },
  { label: 'Patient', value: 'Patient' },
]

const SignUpScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false) // Move this line inside the component

  const [data, setData] = useState({
    fullName: '',
    email: '',
    password: '',
    check_fullNameInputChange: false,
    check_emailInputChange: false,
    secureTextEntry: true,
    userType: null,
    emailError: '',
    passwordError: '',
  })

  const [agreeCheckbox, setAgreeCheckbox] = useState(false)

  const fullNameInputChange = (val) => {
    if (val.length !== 0) {
      setData({
        ...data,
        fullName: val,
        check_fullNameInputChange: true,
      })
    } else {
      setData({
        ...data,
        fullName: val,
        check_fullNameInputChange: false,
      })
    }
  }

  const validateEmail = (email) => {
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    return pattern.test(email)
  }

  const emailInputChange = (val) => {
    if (val.length !== 0) {
      if (validateEmail(val)) {
        setData({
          ...data,
          email: val,
          check_emailInputChange: true,
          emailError: '',
        })
      } else {
        setData({
          ...data,
          email: val,
          check_emailInputChange: false,
          emailError: 'Invalid email format',
        })
      }
    } else {
      setData({
        ...data,
        email: val,
        check_emailInputChange: false,
        emailError: '',
      })
    }
  }

  const validatePassword = (password) => {
    const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    return pattern.test(password)
  }

  const handlePasswordChange = (val) => {
    if (val.length !== 0) {
      if (validatePassword(val)) {
        setData({
          ...data,
          password: val,
          passwordError: '',
        })
      } else {
        setData({
          ...data,
          password: val,
          passwordError:
            'Password should be 8+ characters with at least 1 uppercase, 1 lowercase, and 1 digit.',
        })
      }
    } else {
      setData({
        ...data,
        password: val,
        passwordError: '',
      })
    }
  }

  const handleUserTypeChange = (item) => {
    setData({
      ...data,
      userType: item.value,
    })
  }

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    })
  }

  // Helper function to navigate based on the user type
  const navigateByUserType = (userType) => {
    if (userType === 'Doctor') {
      navigation.navigate('DocDashboard')
    } else if (userType === 'Patient') {
      navigation.navigate('PatDashboard')
    }
  }

  // Helper function to handle specific errors
  const handleError = (error) => {
    if (error.code === 'auth/email-already-in-use') {
      Burnt.toast({
        title: 'Email is already in use. Please use another email address!',
        preset: 'error',
        from: 'bottom',
        haptic: 'error',
        duration: 5,
      })
    } else {
      Burnt.toast({
        title: 'An error occurred during registration. Please try again later.',
        preset: 'none',
        from: 'bottom',
        duration: 5,
      })
    }
  }

  // Main sign up handler
  const handleSignUp = async () => {
    setIsLoading(true)

    if (
      data.fullName &&
      data.email &&
      data.password &&
      data.userType &&
      agreeCheckbox
    ) {
      try {
        const result = await signupHandle(
          data.fullName,
          data.email,
          data.password,
          data.userType,
        )

        if (result.success) {
          Burnt.toast({
            title: 'Registration successful!',
            preset: 'done',
            from: 'bottom',
            duration: 5,
          })
          navigateByUserType(result.userType)
        } else {
          handleError(result.error)
        }
      } catch (error) {
        console.error('Error during registration:', error)
        Burnt.toast({
          title:
            'An error occurred during registration. Please try again later.',
          preset: 'none',
          from: 'bottom',
          duration: 5,
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      console.log('Incomplete registration data')
      Burnt.toast({
        title: 'Incomplete registration data!',
        preset: 'none',
        from: 'bottom',
        duration: 5,
      })
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1069AD" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Register Now!</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView>
          {/* Full Name */}
          <Text style={styles.text_footer}>Full Name</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Full Name"
              style={[styles.textInput, { fontFamily: 'Roboto' }]}
              autoCapitalize="none"
              onChangeText={(val) => fullNameInputChange(val)}
            />
            {data.check_fullNameInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>

          {/* Email */}
          <Text style={[styles.text_footer, { marginTop: 35 }]}>Email</Text>
          <View style={styles.action}>
            <Feather name="mail" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Email"
              style={[styles.textInput, { fontFamily: 'Roboto' }]}
              autoCapitalize="none"
              onChangeText={(val) => emailInputChange(val)}
            />
            {data.check_emailInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>
          {data.emailError ? (
            <Text style={[styles.errorText, { fontFamily: 'Roboto' }]}>
              {data.emailError}
            </Text>
          ) : null}

          {/* Password */}
          <Text style={[styles.text_footer, { marginTop: 35 }]}>Password</Text>
          <View style={styles.action}>
            <FontAwesome name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Password"
              secureTextEntry={data.secureTextEntry ? true : false}
              style={[styles.textInput, { fontFamily: 'Roboto' }]}
              autoCapitalize="none"
              onChangeText={(val) => handlePasswordChange(val)}
            />
            <TouchableOpacity onPress={updateSecureTextEntry}>
              {data.secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>
          {data.passwordError ? (
            <Text style={[styles.errorText, { fontFamily: 'Roboto' }]}>
              {data.passwordError}
            </Text>
          ) : null}

          {/* User Type */}
          <Text style={[styles.text_footer, { marginTop: 35 }]}>User Type</Text>
          <View style={styles.action}>
            <Feather name="users" color="#05375a" size={20} />
            <Dropdown
              style={[styles.dropdown, { fontFamily: 'Roboto' }]}
              placeholderStyle={[
                styles.placeholderStyle,
                { fontFamily: 'Roboto' },
              ]}
              selectedTextStyle={[
                styles.selectedTextStyle,
                { fontFamily: 'Roboto' },
              ]}
              inputSearchStyle={[
                styles.inputSearchStyle,
                { fontFamily: 'Roboto' },
              ]}
              iconStyle={styles.iconStyle}
              data={UserTypeData}
              labelField="label"
              valueField="value"
              placeholder="Select User Type"
              value={data.userType}
              onChange={handleUserTypeChange}
            />
          </View>

          {/* Checkbox */}
          <View style={styles.checkBoxContainer}>
            <TouchableOpacity
              style={styles.checkBox}
              onPress={() => setAgreeCheckbox(!agreeCheckbox)}
            >
              {agreeCheckbox ? (
                <Feather name="check-square" color="#1069AD" size={20} />
              ) : (
                <Feather name="square" color="#1069AD" size={20} />
              )}
              <View style={styles.textPrivate}>
                <Text
                  style={[styles.color_textPrivate, { fontFamily: 'Roboto' }]}
                >
                  By signing up you agree to our
                </Text>
                <Text
                  style={[
                    styles.color_textPrivate,
                    { fontWeight: 'bold', fontFamily: 'Roboto' },
                  ]}
                >
                  {' '}
                  Terms of service
                </Text>
                <Text
                  style={[styles.color_textPrivate, { fontFamily: 'Roboto' }]}
                >
                  {' '}
                </Text>
                <Text
                  style={[
                    styles.color_textPrivate,
                    { fontWeight: 'bold', fontFamily: 'Roboto' },
                  ]}
                >
                  {' '}
                  Privacy policy
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <TouchableOpacity style={styles.signIn} onPress={handleSignUp}>
            <LinearGradient
              colors={['#1069AD', '#0C5A97']}
              style={[styles.signIn, { fontFamily: 'Roboto' }]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text
                  style={[
                    styles.textSign,
                    { color: '#fff', fontFamily: 'Roboto' },
                  ]}
                >
                  Sign Up
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={[
              styles.signIn,
              {
                borderColor: '#1069AD',
                borderWidth: 1,
                marginTop: 15,
              },
            ]}
          >
            <Text
              style={[
                styles.textSign,
                { color: '#1069AD', fontFamily: 'Roboto' },
              ]}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animatable.View>
      <Footer />
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
    paddingBottom: 15,
  },
  footer: {
    flex: Platform.OS === 'ios' ? 3 : 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
    paddingBottom: 25,
    fontFamily: 'Roboto',
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
    fontFamily: 'Roboto',
  },
  action: {
    flexDirection: 'row',
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -5,
    paddingLeft: 10,
    color: '#05375a',
    fontFamily: 'Roboto',
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    fontFamily: 'Roboto',
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 5,
    marginTop: 15,
    fontFamily: 'Roboto',
  },
  color_textPrivate: {
    color: 'grey',
    fontFamily: 'Roboto',
  },
  dropdown: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -6,
    paddingLeft: 10,
    color: '#05375a',
    fontFamily: 'Roboto',
  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    fontFamily: 'Roboto',
  },
})

export default SignUpScreen
