import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import {Ionicons} from '@expo/vector-icons'

const SearchBar = () => (
  <View style={styles.searchBarContainer}>
    <Ionicons name="ios-search" size={20} color="#888" />
    <TextInput placeholder="Search..." style={styles.searchInput} />
  </View>
)

const UpcomingAppointmentCard = () => (
  <View style={styles.appointmentCard}>
    <View style={styles.appointmentTop}>
      <Image
        source={require('./assets/images/head-3.jpg')}
        style={styles.patientImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.patientName}>Sara Jones</Text>
        <Text style={styles.appointmentType}>Regular Checkup</Text>
      </View>
      <View style={styles.iconContainer}>
        <Ionicons
          name="ios-videocam"
          size={24}
          color="#1069AD"
          style={styles.icon}
        />
        <Ionicons name="ios-chatbubbles" size={24} color="#1069AD" />
      </View>
    </View>
    <View style={styles.appointmentDateContainer}>
      <Ionicons name="ios-calendar" size={20} color="#1069AD" />
      <Text style={styles.appointmentDate}>Friday, 15 Sep</Text>
      <Ionicons name="ios-time" size={20} color="#1069AD" style={styles.icon} />
      <Text style={styles.appointmentTime}>09:00 - 10:00</Text>
    </View>
  </View>
)

const StatItem = ({label, count}) => (
  <View style={styles.statItem}>
    <Text style={styles.statCount}>{count}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
)

const StatsSection = () => (
  <View style={styles.statsContainer}>
    <StatItem label="Patients Treated" count={34} />
    <StatItem label="Medicines Prescribed" count={52} />
    {/* Here you can add other stats */}
  </View>
)

const QuickAccessItem = ({iconName, label}) => (
  <TouchableOpacity style={styles.quickAccessItem}>
    <Ionicons name={iconName} size={28} color="#1069AD" />
    <Text style={styles.quickAccessLabel}>{label}</Text>
  </TouchableOpacity>
)

const QuickAccessSection = () => (
  <View style={styles.quickAccessContainer}>
    <QuickAccessItem iconName="ios-person" label="Patients" />
    <QuickAccessItem iconName="ios-document-text" label="Health Records" />
    <QuickAccessItem iconName="ios-medkit" label="Prescriptions" />
    {/* Here you can add other quick access items */}
  </View>
)

const DoctorDashboardContent = () => (
  <ScrollView style={styles.dashboardContainer}>
    <SearchBar />
    <UpcomingAppointmentCard />
    <StatsSection />
    <QuickAccessSection />
    {/* Here you can add other sections or components you want */}
  </ScrollView>
)

const HomeTab = () => <DoctorDashboardContent />

// Styles:

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4E4E4',
  },
  searchBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    margin: 10,
    alignItems: 'center',
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    margin: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  appointmentCard: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 10,
  },
  appointmentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  patientImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  patientName: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  appointmentType: {
    marginBottom: 10,
  },
  appointmentDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  appointmentDate: {
    marginLeft: 5,
    marginRight: 15,
  },
  appointmentTime: {
    marginLeft: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    marginTop: 5,
  },
  quickAccessContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  quickAccessItem: {
    alignItems: 'center',
  },
  quickAccessLabel: {
    marginTop: 5,
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#E4E4E4',
  },
})

export default HomeTab
