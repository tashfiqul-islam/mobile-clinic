import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native'
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'

const { width } = Dimensions.get('window')

const patientData = {
  name: 'John Doe',
  location: 'Quebec, Canada',
  rating: 4.7,
  age: 35,
  gender: 'Male',
  date: '20th Sep 2023',
  type: 'Check-up',
  tags: ['Diabetes', 'Chronic Heart Diseases'],
  notes: 'Occasional dizziness.',
  prescriptions: [
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
  ],
  medicines: ['Medicine1', 'Medicine2', 'Medicine3'],
}

const AppointmentDetails = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Top Section - Frosted Glass Avatar */}
      <View style={styles.frostedContainer}>
        <Image
          source={{
            uri: 'https://images.pexels.com/photos/307008/pexels-photo-307008.jpeg',
          }}
          style={styles.backgroundImage}
        />
        <View style={styles.frostedOverlay} />
      </View>
      {/* Frosted Glassmorphism Card */}
      <View style={styles.glassCard}>
        <Text style={styles.nameText}>{patientData.name}</Text>
        <Text style={styles.locationText}>{patientData.location}</Text>
        <View style={styles.detailRow}>
          <Ionicons name='star' size={20} color='#1069AD' />
          <Text style={styles.detailText}>{patientData.rating}</Text>
          <View style={styles.separator} />
          <FontAwesome name='calendar' size={20} color='#1069AD' />
          <Text style={styles.detailText}>{patientData.age}</Text>
          <View style={styles.separator} />
          <MaterialCommunityIcons
            name='gender-male-female'
            size={20}
            color='#1069AD'
          />
          <Text style={styles.detailText}>{patientData.gender}</Text>
        </View>
      </View>

      {/* Modern Interactive Details */}
      <View style={styles.detailsContainer}>
        {/* Details */}
        <View style={styles.appointmentDetailsContainer}>
          <View style={styles.infoRow}>
            <MaterialIcons name='event' size={24} color='#1069AD' />
            <Text style={styles.infoText}>Appointment: {patientData.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name='medical-services' size={24} color='#1069AD' />
            <Text style={styles.infoText}>Type: {patientData.type}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name='tags' size={24} color='#1069AD' />
            <Text style={styles.infoText}>
              Concerns: {patientData.tags.join(', ')}
            </Text>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notesContainer}>
          <Text style={styles.notesHeader}>Notes:</Text>
          <Text style={styles.notesText}>{patientData.notes}</Text>
        </View>

        {/* Medicines */}
        <View style={styles.medicinesContainer}>
          <Text style={styles.medicinesHeader}>Prescribed Medicines:</Text>
          {patientData.medicines.map((medicine, index) => (
            <View key={index} style={styles.medicineItem}>
              <MaterialIcons name='local-pharmacy' size={24} color='#1069AD' />
              <Text style={styles.medicineText}>{medicine}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={[styles.fab, styles.fabVideoCall]}>
          <MaterialIcons name='videocam' size={24} color='#FFF' />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fab, styles.fabCall]}>
          <MaterialIcons name='call' size={24} color='#FFF' />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fab, styles.fabMessage]}>
          <MaterialIcons name='message' size={24} color='#FFF' />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4E4E4',
  },
  frostedContainer: {
    width: width,
    height: 220,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  frostedOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
  },
  glassCard: {
    position: 'absolute',
    top: width - 230,
    left: 20,
    right: 20,
    height: 90,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: 22,
    color: '#1069AD',
    marginBottom: 0,
    marginTop: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#1069AD',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 15,
    marginLeft: 10,
    color: '#1069AD',
  },
  separator: {
    height: '70%',
    width: 1,
    backgroundColor: '#1069AD',
    marginHorizontal: 10,
  },
  detailsContainer: {
    marginTop: 50,
    margin: 15,
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#555',
  },
  notesContainer: {
    marginTop: 20,
  },
  notesHeader: {
    fontSize: 18,
    marginBottom: 10,
    color: '#1069AD',
  },
  notesText: {
    fontSize: 16,
    color: '#555',
  },
  medicinesContainer: {
    marginTop: 20,
  },
  medicinesHeader: {
    fontSize: 18,
    marginBottom: 10,
    color: '#1069AD',
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  medicineText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#555',
  },
  fabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  fab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabVideoCall: {
    backgroundColor: '#1069AD',
  },
  fabCall: {
    backgroundColor: '#1069AD',
  },
  fabMessage: {
    backgroundColor: '#1069AD',
  },
})

export default AppointmentDetails
