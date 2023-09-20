import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Animatable from 'react-native-animatable'
import { Feather } from '@expo/vector-icons'
import { useTheme, TextInput as PaperTextInput } from 'react-native-paper'
import * as Burnt from 'burnt'
import * as ImagePicker from 'expo-image-picker'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import 'firebase/compat/storage'
import { firebaseConfig } from './firebaseConfig'
import { useUser } from './UserContext'

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

const EditableField = ({
  icon,
  value,
  onEdit,
  editable,
  onFocus,
  onUpdate,
  showHelperText,
  isPassword,
  showEditIcon = true, // Default value is true
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [fieldValue, setFieldValue] = useState(value)
  const inputRef = useRef(null)
  const shouldShowHelperText = showHelperText && !fieldValue

  const handleEdit = () => {
    if (isEditing) {
      handleUpdate()
    } else {
      setIsEditing(true)
    }
  }

  const handleChange = text => {
    setFieldValue(text)
  }

  const handleUpdate = async () => {
    setIsEditing(false)
    await onUpdate(fieldValue)
  }

  if (icon === 'log-out') {
    return (
      <TouchableOpacity onPress={handleUpdate} style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Feather name={icon} size={20} color='grey' />
        </View>
        <View style={styles.textInputContainer}>
          <Text style={styles.fieldText}>
            {isPassword ? '********' : fieldValue}
          </Text>
        </View>
      </TouchableOpacity>
    )
  } else {
    return (
      <TouchableWithoutFeedback
        onPress={() => inputRef.current && inputRef.current.blur()}>
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Feather name={icon} size={20} color='grey' />
          </View>
          <View style={styles.textInputContainer}>
            {isEditing ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <PaperTextInput
                  onFocus={onFocus}
                  ref={inputRef}
                  style={[styles.textInput, { height: 40 }]}
                  value={fieldValue}
                  onChangeText={handleChange}
                  onBlur={handleUpdate}
                  textAlignVertical='top'
                  secureTextEntry={isPassword}
                />
              </View>
            ) : (
              <Text style={styles.fieldText}>
                {isPassword ? '********' : fieldValue}
              </Text>
            )}
          </View>
          {showEditIcon && (
            <TouchableOpacity style={styles.editIcon} onPress={handleEdit}>
              <Feather
                name={isEditing ? 'check' : 'edit'}
                size={20}
                color='grey'
              />
            </TouchableOpacity>
          )}
          {shouldShowHelperText && (
            <Text style={styles.helperText}>Add a location</Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const ProfileTab = () => {
  const {
    userFullName,
    setUserFullName,
    userEmail,
    setUserEmail,
    userBio,
    setUserBio,
    userLocation,
    setUserLocation,
    userImage,
    setUserImage,
  } = useUser()

  const navigation = useNavigation()
  const { colors } = useTheme()

  const [isEditingBio, setIsEditingBio] = useState(false)
  const [editingBio, setEditingBio] = useState(userBio)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [isEditingLocation, setIsEditingLocation] = useState(false)
  const [editingLocation, setEditingLocation] = useState(userLocation)
  const [isUploading, setIsUploading] = useState(false)

  const handleEditBio = () => {
    setEditingBio(userBio || '')
    setIsEditingBio(true)
  }

  const handleUpdateBio = async () => {
    if (editingBio) {
      await updateUserBio(editingBio)
    }
    setIsEditingBio(false)
  }

  const handleEditPassword = () => {
    setIsEditingPassword(true)
  }

  const handleUpdatePassword = async () => {
    if (editingPassword) {
      await updatePassword(editingPassword)
    }
    setIsEditingPassword(false)
  }

  const handleEditLocation = () => {
    setIsEditingLocation(true)
  }

  const handleUpdateLocation = async () => {
    if (editingLocation) {
      await updateLocation(editingLocation)
    }
    setIsEditingLocation(false)
  }

  const DEFAULT_IMAGE_URL =
    'https://firebasestorage.googleapis.com/v0/b/mclinic-df2b5.appspot.com/o/profile_images%2FdefaultProfile.png?alt=media&token=600ebca7-a028-428c-9199-3bd7464cf216'

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut()

      setUserFullName('')
      setUserEmail('')
      setUserBio('')
      setUserLocation('')

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  useEffect(() => {
    ;(async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    })()
  }, [])

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      if (!result.canceled && result.assets) {
        uploadImage(result.assets[0].uri)
      }
    } catch (error) {
      console.error('Error picking image:', error)
    }
  }

  const uploadImage = async uri => {
    try {
      setIsUploading(true)
      const response = await fetch(uri)
      const blob = await response.blob()
      const user = firebase.auth().currentUser
      if (!user) return

      const ref = firebase.storage().ref().child(`profile_images/${user.uid}`)
      await ref.put(blob)
      const url = await ref.getDownloadURL()

      setUserImage({ uri: url })
      updateUserImageURLInFirebase(url)
    } catch (error) {
      console.error('Image upload error:', error.message)

      // Error message for users
      Burnt.toast({
        from: 'bottom',
        title: 'Failed to upload image!',
        shouldDismissByDrag: true,
        preset: 'error',
        haptic: 'error',
        duration: 5,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const updateUserImageURLInFirebase = async url => {
    const user = firebase.auth().currentUser
    if (user) {
      const userUid = user.uid
      const userRef = firebase.database().ref(`users/${userUid}`)
      await userRef.update({ profileImage: url })

      if (url && url.trim() !== '') {
        setUserImage(url)
      } else {
        setUserImage(require('./assets/images/defaultProfile.png'))
      }

      Burnt.toast({
        from: 'bottom',
        title: 'Picture updated successfully!',
        shouldDismissByDrag: true,
        preset: 'done',
        haptic: 'success',
        duration: 5,
      })
    }
  }

  const updateFullName = async newFullName => {
    try {
      const user = firebase.auth().currentUser
      if (user) {
        const userUid = user.uid
        const userRef = firebase.database().ref(`users/${userUid}`)
        await userRef.update({ fullName: newFullName })

        setUserFullName(newFullName)

        Burnt.toast({
          from: 'bottom',
          title: 'Name updated successfully!',
          shouldDismissByDrag: true,
          preset: 'done',
          haptic: 'success',
          duration: 5,
        })

        return { success: true, message: 'Full name updated successfully' }
      } else {
        return { success: false, message: 'User is not signed in' }
      }
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred while updating the full name',
      }
    }
  }

  const updateEmail = async newEmail => {
    try {
      const user = firebase.auth().currentUser
      if (user) {
        await user.updateEmail(newEmail)
        const userUid = user.uid
        const userRef = firebase.database().ref(`users/${userUid}`)
        await userRef.update({ email: newEmail })

        setUserEmail(newEmail)

        Burnt.toast({
          from: 'bottom',
          title: 'Email updated successfully!',
          shouldDismissByDrag: true,
          preset: 'done',
          haptic: 'success',
          duration: 5,
        })

        return { success: true, message: 'Email updated successfully' }
      } else {
        return { success: false, message: 'User is not signed in' }
      }
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred while updating the email',
      }
    }
  }

  const updateUserBio = async newBio => {
    try {
      const user = firebase.auth().currentUser
      if (user) {
        const userUid = user.uid
        const userRef = firebase.database().ref(`users/${userUid}`)
        await userRef.update({ userBio: newBio })

        setUserBio(newBio)

        Burnt.toast({
          from: 'bottom',
          title: 'Bio updated successfully!',
          shouldDismissByDrag: true,
          preset: 'done',
          haptic: 'success',
          duration: 5,
        })

        return { success: true, message: 'Bio updated successfully' }
      } else {
        return { success: false, message: 'User is not signed in' }
      }
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred while updating the bio',
      }
    }
  }

  const updatePassword = async newPassword => {
    try {
      const user = firebase.auth().currentUser
      if (user) {
        await user.updatePassword(newPassword)
        // Note: Removed the setUserPassword(newPassword) since we're not storing the password anymore
        Burnt.toast({
          from: 'bottom',
          title: 'Password updated successfully!',
          shouldDismissByDrag: true,
          preset: 'done',
          haptic: 'success',
          duration: 5,
        })

        return { success: true, message: 'Password updated successfully' }
      } else {
        return { success: false, message: 'User is not signed in' }
      }
    } catch (error) {
      console.log('Firebase Error:', error.message) // Log the specific Firebase error
      return {
        success: false,
        message: 'An error occurred while updating the password',
      }
    }
  }

  const updateLocation = async newLocation => {
    try {
      const user = firebase.auth().currentUser
      if (user) {
        const userUid = user.uid
        const userRef = firebase.database().ref(`users/${userUid}`)
        await userRef.update({ location: newLocation })

        // Set the newLocation in the user context
        setUserLocation(newLocation)

        Burnt.toast({
          from: 'bottom',
          title: 'Location updated successfully!',
          shouldDismissByDrag: true,
          preset: 'done',
          haptic: 'success',
          duration: 5,
        })

        return { success: true, message: 'Location updated successfully' }
      } else {
        return { success: false, message: 'User is not signed in' }
      }
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred while updating the location',
      }
    }
  }

  const defaultImage = { uri: DEFAULT_IMAGE_URL }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled>
      <StatusBar backgroundColor='#1069AD' barStyle='light-content' />
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              userImage &&
              typeof userImage === 'string' &&
              userImage.trim() !== ''
                ? { uri: userImage }
                : defaultImage
            }
            style={styles.profileImage}
          />
          {isUploading ? (
            <ActivityIndicator
              size='large'
              color='#1069AD'
              style={styles.loader}
            />
          ) : (
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={pickImage}>
              <Feather name='edit' size={14} color='grey' />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Animatable.View
        animation='fadeInUpBig'
        style={[
          styles.footer,
          {
            backgroundColor: '#E5E5E5',
          },
        ]}>
        <Text style={styles.primaryText}>Dr. {userFullName}</Text>
        <Text style={styles.secondaryText}>
          📍 {userLocation || 'Update location'}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          {isEditingBio ? (
            <>
              <PaperTextInput
                style={styles.textInputBio}
                value={editingBio}
                onChangeText={setEditingBio}
                onBlur={handleUpdateBio}
              />
              <TouchableOpacity onPress={handleUpdateBio}>
                <Feather name='check' size={14} color='grey' />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.bioText}>{userBio || 'Add a bio'}</Text>
              <TouchableOpacity onPress={handleEditBio}>
                <Feather name='edit' size={14} color='grey' />
              </TouchableOpacity>
            </>
          )}
        </View>
        <ScrollView>
          <EditableField
            icon='user'
            value={userFullName}
            onUpdate={async newFullName => {
              const response = await updateFullName(newFullName)
              if (!response.success) {
                console.log('Failed to update full name in the UI')
              }
            }}
          />
          <EditableField
            icon='mail'
            value={userEmail}
            onUpdate={async newEmail => {
              const response = await updateEmail(newEmail)
              if (!response.success) {
                console.log('Failed to update email in the UI')
              }
            }}
          />
          <EditableField
            icon='lock'
            value='********' // placeholder value
            onUpdate={async newPassword => {
              const response = await updatePassword(newPassword)
              if (!response.success) {
                console.log('Failed to update password in the UI')
              }
            }}
            isPassword={true}
          />

          <EditableField
            icon='map-pin'
            value={userLocation}
            onFocus={() => {
              setIsEditingLocation(true)
            }}
            onUpdate={async newLocation => {
              const response = await updateLocation(newLocation)
              if (!response.success) {
                console.log('Failed to update location in the UI')
              }
            }}
            showHelperText={!userLocation} // Show the helper text only if there's no location set
          />
          <EditableField
            icon='log-out'
            value='Logout'
            onUpdate={handleLogout}
            editable={false}
          />
          {isEditingLocation && (
            <View
              style={{
                height: '30%',
              }}
            />
          )}
        </ScrollView>
      </Animatable.View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1069AD',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 50,
    marginTop: 35,
  },
  footer: {
    flex: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 50,
    marginTop: -25,
  },
  profileImageContainer: {
    width: 170,
    height: 170,
    borderRadius: 80,
    position: 'absolute',
    top: Platform.OS === 'ios' ? -15 : -10,
    left: 30,
    zIndex: 1,
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
    zIndex: 2, // Ensure it's above the image
  },
  profileImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    resizeMode: 'cover',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#FFFFFF', // Color of the border, change as needed
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
  },
  primaryText: {
    color: 'black',
    textAlign: 'right',
    fontSize: 24,
    bottom: 40,
    paddingRight: 0,
    fontWeight: 'bold',
    marginTop: 10,
  },
  secondaryText: {
    color: 'grey',
    textAlign: 'right',
    fontSize: 16,
    bottom: 35,
  },
  secondaryText2: {
    color: 'black',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
  },
  iconContainer: {
    padding: 15,
  },
  textInputContainer: {
    flex: 1,
    padding: 5,
  },
  fieldText: {
    color: 'black',
    fontSize: 16,
  },
  textInput: {
    flex: 1,
    color: 'black',
    fontSize: 16,
    padding: 0,
    margin: 0,
    height: 40,
    textAlignVertical: 'center',
  },
  editIcon: {
    padding: 10,
  },
  textInputBio: {
    flex: 1,
    color: 'black',
    fontSize: 14,
    padding: 0,
    margin: 0,
    height: 40,
    textAlignVertical: 'center',
  },
  bioText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 14,
    marginRight: 5, // This will give a small space between the text and the icon
  },
  helperText: {
    color: 'grey',
    fontSize: 12,
    position: 'absolute',
    bottom: 19,
    left: 55,
  },
  button1: {
    alignItems: 'center',
    marginTop: 12,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
  },
})

export default ProfileTab
