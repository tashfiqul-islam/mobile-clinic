import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { Feather } from '@expo/vector-icons';
import { useTheme, TextInput as PaperTextInput } from 'react-native-paper';
import * as Burnt from 'burnt';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { firebaseConfig } from './firebaseConfig';
import { useUser } from './UserContext';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const EditableField = ({ icon, value, onEdit, editable, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);
  const inputRef = useRef(null);

  const handleEdit = () => {
    if (isEditing) {
      handleUpdate();
    } else {
      setIsEditing(true);
    }
  };

  const handleChange = (text) => {
    setFieldValue(text);
  };

  const handleUpdate = async () => {
    setIsEditing(false);
    await onUpdate(fieldValue);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => inputRef.current && inputRef.current.blur()}
    >
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Feather name={icon} size={20} color="grey" />
        </View>
        <View style={styles.textInputContainer}>
          {isEditing ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <PaperTextInput
                ref={inputRef}
                style={styles.textInput}
                value={fieldValue}
                onChangeText={handleChange}
                onBlur={handleUpdate}
                textAlignVertical="top"
              />
            </View>
          ) : (
            <Text style={styles.fieldText}>{fieldValue}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.editIcon} onPress={handleEdit}>
          <Feather
            name={isEditing ? 'check' : 'edit'}
            size={20}
            color="grey"
          />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const ProfileTab = () => {
    const { userFullName, setUserFullName, userEmail, setUserEmail } = useUser();
  const navigation = useNavigation();
  const { colors } = useTheme();

  const updateFullName = async (newFullName) => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const userUid = user.uid;
        const userRef = firebase.database().ref(`users/${userUid}`);
        await userRef.update({ fullName: newFullName });
        

        setUserFullName(newFullName);

        Burnt.toast({
          from: 'bottom',
          title: 'Name updated successfully!',
          shouldDismissByDrag: true,
          preset: 'done',
          haptic: 'success',
          duration: 5,
        });

        return { success: true, message: 'Full name updated successfully' };
      } else {
        return { success: false, message: 'User is not signed in' };
      }
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred while updating the full name',
      };
    }
  };

  const updateEmail = async (newEmail) => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        console.log('User is signed in:', user.uid); // Debug log
  
        // Update the email in Firebase Authentication
        await user.updateEmail(newEmail);
  
        // ... (Rest of the code to update the email in the Firebase Realtime Database)
  
        Burnt.toast({
          from: 'bottom',
          title: 'Email updated successfully!',
          shouldDismissByDrag: true,
          preset: 'done',
          haptic: 'success',
          duration: 5,
        });
  
        return { success: true, message: 'Email updated successfully' };
      } else {
        console.log('User is not signed in'); // Debug log
        return { success: false, message: 'User is not signed in' };
      }
    } catch (error) {
      console.error('Error updating email:', error); // Debug log
      return {
        success: false,
        message: 'An error occurred while updating the email',
      };
    }
  };  
    

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <StatusBar backgroundColor="#1069AD" barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('./assets/images/head-4.jpg')}
            style={styles.profileImage}
          />
        </View>
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <Text style={styles.primaryText}>{userFullName}</Text>
        <Text style={styles.secondaryText}>Minneapolis, MN</Text>
        <Text style={styles.secondaryText2}>
          I'm a fun-loving person who enjoys healing people. I enjoy traveling and meeting new people!
        </Text>

        <EditableField
          icon="user"
          value={userFullName}
          onUpdate={async (newFullName) => {
            const response = await updateFullName(newFullName);
            if (!response.success) {
              console.log('Failed to update full name in the UI');
            }
          }}
        />
        <EditableField
            icon="mail"
            value={userEmail} // Pass the userEmail here
            onUpdate={async (newEmail) => {
                const response = await updateEmail(newEmail);
                if (!response.success) {
                    console.log('Failed to update email in the UI');
            }
            }}
        />

        <EditableField icon="lock" value="********" />
        <EditableField icon="map-pin" value="Minneapolis, MN" />
      </Animatable.View>
    </KeyboardAvoidingView>
  );
};

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
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 50,
    marginTop: -25,
  },
  profileImageContainer: {
    width: 160,
    height: 160,
    borderRadius: 100,
    overflow: 'hidden',
    position: 'absolute',
    top: Platform.OS === 'ios' ? -15 : -10, // Adjust the top position for iOS and Android
    alignSelf: 'center',
    zIndex: 1,
  },
  profileImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  primaryText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 24,
    marginTop: 50,
    fontWeight: 'bold',
  },
  secondaryText: {
    color: 'grey',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
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
    backgroundColor: '#fff',
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
});

export default ProfileTab;
