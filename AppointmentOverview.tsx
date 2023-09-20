import React from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
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
      {/* Full-width Avatar */}
      <Image
        source={{
          uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        }}
        style={styles.profileImage}
      />

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

      {/* Date & Type */}
      <View style={styles.dateTypeBar}>
        <View style={styles.dateTypeItem}>
          <FontAwesome name='calendar' size={24} color='#1069AD' />
          <Text style={styles.dateTypeText}>{patientData.date}</Text>
        </View>
        <View style={styles.dateTypeItem}>
          <MaterialIcons name='meeting-room' size={24} color='#1069AD' />
          <Text style={styles.dateTypeText}>{patientData.type}</Text>
        </View>
      </View>

      {/* Tags */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tagContainer}>
        {patientData.tags.map((tag, index) => (
          <View style={styles.tag} key={index}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Expandable Patient Notes */}
      <TouchableOpacity style={styles.expandableSection}>
        <Text style={styles.sectionHeader}>Patient Notes:</Text>
        <Text style={styles.sectionContent}>{patientData.notes}</Text>
      </TouchableOpacity>

      {/* Old Prescriptions */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}>
        {patientData.prescriptions.map((prescription, index) => (
          <Image
            key={index}
            source={{ uri: prescription }}
            style={styles.carouselImage}
          />
        ))}
      </ScrollView>

      {/* Current/Old Medicines */}
      <View style={styles.medicineList}>
        <Text style={styles.sectionHeader}>Medicines:</Text>
        {patientData.medicines.map((medicine, index) => (
          <View key={index} style={styles.medicineItem}>
            <MaterialIcons name='local-pharmacy' size={20} color='#1069AD' />
            <Text style={styles.medicineText}>{medicine}</Text>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.button}>
          <MaterialIcons name='videocam' size={24} color='#FFF' />
          <Text style={styles.buttonText}>Video Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <MaterialIcons name='call' size={24} color='#FFF' />
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <MaterialIcons name='message' size={24} color='#FFF' />
          <Text style={styles.buttonText}>Message</Text>
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
  profileImage: {
    width: width,
    height: width - 200,
  },
  glassCard: {
    position: 'absolute',
    top: width - 248,
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
  dateTypeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#E4E4E4',
  },
  dateTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTypeText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#1069AD',
  },
  tagContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 10,
    marginLeft: 10,
  },
  tagText: {
    color: '#1069AD',
  },
  expandableSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    marginHorizontal: 10,
    padding: 15,
  },
  sectionHeader: {
    fontSize: 18,
    marginBottom: 10,
    color: '#1069AD',
  },
  sectionContent: {
    fontSize: 16,
    color: '#555',
  },
  carousel: {
    marginVertical: 15,
  },
  carouselImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  medicineList: {
    marginVertical: 15,
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginLeft: 20,
  },
  medicineText: {
    marginLeft: 10,
    color: '#555',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#1069AD',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 10,
    color: '#FFF',
  },
})

export default AppointmentDetails
