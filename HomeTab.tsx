import React, {useEffect, useRef, useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import {LinearGradient} from 'expo-linear-gradient'

const SCREEN_WIDTH = Dimensions.get('window').width

const SearchBar = () => (
  <View style={styles.searchBarContainer}>
    <Ionicons name="ios-search" size={20} color="#888" />
    <TextInput placeholder="Search..." style={styles.searchInput} />
  </View>
)

const UpcomingScheduleHeader = () => (
  <View style={styles.upcomingScheduleHeader}>
    <Text style={styles.upcomingText}>Upcoming Schedule</Text>
    <View style={styles.countCircle}>
      <Text style={styles.countText}>3</Text>
    </View>
    <Text style={styles.seeAllText}>View All</Text>
  </View>
)

const UpcomingAppointmentCard = ({item}) => (
  <LinearGradient
    colors={['#1069AD', '#0C5A97']}
    start={[0, 0]}
    end={[1, 1]}
    style={styles.appointmentCard}>
    <View style={styles.appointmentContent}>
      <View style={styles.appointmentTop}>
        <Image source={item.image} style={styles.patientImage} />
        <View style={styles.textContainer}>
          <Text style={[styles.patientName, {color: '#FFFFFF'}]}>
            {item.name}
          </Text>
          <Text style={[styles.appointmentType, {color: '#FFFFFF'}]}>
            {item.type}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons
            name="ios-videocam"
            size={24}
            color="#FFFFFF"
            style={[styles.icon, styles.icon3D]}
          />
          <Ionicons
            name="ios-chatbubbles"
            size={24}
            color="#FFFFFF"
            style={styles.icon3D}
          />
        </View>
      </View>
      <View
        style={[styles.appointmentDateContainer, {backgroundColor: '#E4E4E4'}]}>
        <View style={styles.leftAlign}>
          <Ionicons name="ios-calendar" size={20} color="#000000" />
          <Text style={[styles.appointmentDate, {color: '#000000'}]}>
            {item.date}
          </Text>
        </View>
        <Text
          style={{color: '#000000', alignSelf: 'center', marginHorizontal: 10}}>
          |
        </Text>
        <View style={styles.rightAlign}>
          <Ionicons
            name="ios-time"
            size={20}
            color="#000000"
            style={styles.icon}
          />
          <Text style={[styles.appointmentTime, {color: '#000000'}]}>
            {item.time}
          </Text>
        </View>
      </View>
    </View>
  </LinearGradient>
)

const StatsCard = ({iconName, value, label}) => {
  return (
    <View style={styles.statsCard}>
      <Ionicons name={iconName} size={24} style={styles.statsIcon} />
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsLabel}>{label}</Text>
    </View>
  )
}

const CARDS_DATA = [
  {
    id: '1',
    name: 'Sara Jones',
    type: 'Regular Checkup',
    date: 'Friday, 15 Sep',
    time: '09:00 - 10:00',
    image: require('./assets/images/head-4.jpg'),
  },
  {
    id: '2',
    name: 'John Doe',
    type: 'Dental Cleaning',
    date: 'Saturday, 16 Sep',
    time: '11:00 - 12:00',
    image: require('./assets/images/pat-1.jpeg'),
  },
  {
    id: '3',
    name: 'Mike Smith',
    type: 'Eye Checkup',
    date: 'Sunday, 17 Sep',
    time: '14:00 - 15:00',
    image: require('./assets/images/pat-2.jpeg'),
  },
]

const DoctorDashboardContent = () => {
  const flatListRef = useRef(null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isUserInteracting, setIsUserInteracting] = useState(false)

  useEffect(() => {
    if (!isUserInteracting) {
      const slideShowInterval = setInterval(() => {
        if (currentSlideIndex < CARDS_DATA.length - 1) {
          setCurrentSlideIndex(currentSlideIndex + 1)
          flatListRef.current?.scrollToOffset({
            offset: (currentSlideIndex + 1) * SCREEN_WIDTH,
            animated: true,
          })
        } else {
          setCurrentSlideIndex(0)
          flatListRef.current?.scrollToOffset({
            offset: 0,
            animated: true,
          })
        }
      }, 4000)

      return () => clearInterval(slideShowInterval)
    }
  }, [currentSlideIndex, isUserInteracting])

  return (
    <ScrollView style={styles.dashboardContainer}>
      <SearchBar />
      <UpcomingScheduleHeader />
      <FlatList
        style={{marginBottom: 10}}
        ref={flatListRef}
        data={CARDS_DATA}
        horizontal
        pagingEnabled
        contentContainerStyle={{width: `${100 * CARDS_DATA.length}%`}}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={{width: SCREEN_WIDTH}}>
            <UpcomingAppointmentCard item={item} />
          </View>
        )}
        onScrollBeginDrag={() => setIsUserInteracting(true)}
        onScrollEndDrag={() => setIsUserInteracting(false)}
      />
      <View style={styles.quickStatsHeader}>
        <Text style={styles.quickStatsTitle}>Recent Week Overview</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="refresh" size={24} color="#1069AD" />
        </TouchableOpacity>
      </View>
      <View style={styles.statsGrid}>
        <StatsCard iconName="ios-people" value="15" label="Patients" />
        <StatsCard iconName="ios-document" value="7" label="Prescriptions" />
        <StatsCard iconName="ios-call" value="3" label="ER Calls" />
        <StatsCard iconName="ios-time" value="2" label="Appointments" />
      </View>
    </ScrollView>
  )
}

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
  upcomingScheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: 0, // Added this line
  },
  upcomingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  countCircle: {
    backgroundColor: '#1069AD',
    borderRadius: 50,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -5,
    elevation: 8,
  },
  countText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#1069AD',
    left: 150,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    margin: 5,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  appointmentCard: {
    width: SCREEN_WIDTH - 20, // Adjusting for the margins
    borderRadius: 8,
    marginHorizontal: 10,
    overflow: 'hidden',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 10,
  },
  appointmentContent: {
    margin: 5,
  },
  appointmentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 0,
  },
  patientImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  patientName: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 0,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    marginRight: 10,
  },
  icon3D: {
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5, // for Android
  },
  appointmentType: {
    marginBottom: 25,
  },
  appointmentDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 12, // Made the container bigger
    elevation: 8,
  },
  leftAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  appointmentDate: {
    marginLeft: 5,
  },
  appointmentTime: {
    marginLeft: -5,
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#E4E4E4',
  },
  quickStatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: -10, // Added this line
  },
  quickStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
    paddingHorizontal: 10, // Adjusted padding to align with appointmentCard
    backgroundColor: '#E4E4E4',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  statsCard: {
    width: (SCREEN_WIDTH - 55 - 4 * 5 * 2) / 4, // Adjusted width calculation
    height: (SCREEN_WIDTH - 80 - 4 * 5 * 2) / 4, // Adjusted height calculation
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 5, // Margin on each side
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  statsIcon: {
    color: '#1069AD',
    marginBottom: 3, // Further reduced margin
    fontSize: 24, // Further reduced icon size
  },

  statsValue: {
    fontSize: 16, // Further reduced font size
    fontWeight: 'bold',
  },

  statsLabel: {
    marginTop: 2, // Further reduced margin
    color: '#888',
    fontSize: 10, // Further reduced font size
  },
})

export default HomeTab
