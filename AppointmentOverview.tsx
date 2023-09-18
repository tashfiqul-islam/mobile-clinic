import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const AppointmentOverview = ({ route, navigation }) => {
  const { appointmentData } = route.params
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name='ios-arrow-back' size={24} color='#1069AD' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{appointmentData.patientName}</Text>
      </View>

      <View style={styles.patientInfo}>
        <Image source={appointmentData.image} style={styles.patientImage} />
        <View style={styles.patientDetails}>
          <Text style={styles.patientName}>{appointmentData.patientName}</Text>
          <Text>
            {appointmentData.sex}, {appointmentData.age} years
          </Text>
          <Text>
            {appointmentData.weight} kg, {appointmentData.height} cm
          </Text>
        </View>
      </View>

      <View style={styles.appointmentDetails}>
        <Text style={styles.appointmentType}>{appointmentData.type}</Text>
        <Text>
          {appointmentData.date}, {appointmentData.time}
        </Text>
        <Text style={styles.appointmentStatus}>{appointmentData.status}</Text>
      </View>

      <View style={styles.healthNotes}>
        <Text style={styles.notesTitle}>Reason for Visit:</Text>
        <Text>{appointmentData.issue}</Text>
        <Text style={styles.notesTitle}>Special Notes:</Text>
        <Text>{appointmentData.specialNotes}</Text>
      </View>

      <View style={styles.recordsContainer}>
        <Text style={styles.recordsTitle}>Past Health Records:</Text>
        {/* Render health record icons/buttons here */}
      </View>

      <View style={styles.prescriptionsContainer}>
        <Text style={styles.recordsTitle}>Past Prescriptions:</Text>
        {/* Render prescription icons/buttons here */}
      </View>

      {/* Actions like start video call, chat, etc. can go here */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4E4E4',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1069AD',
    marginLeft: 10,
  },
  patientInfo: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  patientImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  appointmentDetails: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  appointmentType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  appointmentStatus: {
    color: '#888',
    marginTop: 5,
    fontSize: 14,
  },
  healthNotes: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recordsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  prescriptionsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  recordsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  icon: {
    color: '#1069AD',
    marginRight: 5,
  },
  actionIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  iconLabel: {
    color: '#888',
    fontSize: 14,
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: '#d3d3d3',
    marginVertical: 10,
  },
  patientStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordIcon: {
    marginRight: 10,
  },
  recordText: {
    fontSize: 14,
  },
  recordLink: {
    fontSize: 14,
    color: '#1069AD',
    textDecorationLine: 'underline',
  },
})

export default AppointmentOverview
