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
  TouchableNativeFeedback,
  TouchableHighlight,
  Platform,
} from 'react-native'
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import {LinearGradient} from 'expo-linear-gradient'
import {useNavigation} from '@react-navigation/native'

const SCREEN_WIDTH = Dimensions.get('window').width

const Touchable = ({children, style, ...props}) => {
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    return (
      <TouchableNativeFeedback
        {...props}
        useForeground
        background={TouchableNativeFeedback.Ripple('#80adadad', false)}>
        <View style={style}>{children}</View>
      </TouchableNativeFeedback>
    )
  }
  return (
    <TouchableHighlight {...props} underlayColor="#adadad" style={style}>
      {children}
    </TouchableHighlight>
  )
}

const SearchBar = () => (
  <View style={styles.searchBarContainer}>
    <Ionicons name="ios-search" size={20} color="#888" />
    <TextInput placeholder="Search..." style={styles.searchInput} />
  </View>
)

const UpcomingScheduleHeader = ({count}) => {
  const navigation = useNavigation()

  const handleViewAllPress = () => {
    navigation.navigate('AppointmentList')
  }

  return (
    <View style={styles.upcomingScheduleHeader}>
      <Text style={styles.upcomingText}>Upcoming Schedule</Text>
      <View style={styles.countCircle}>
        <Text style={styles.countText}>{count}</Text>
      </View>
      <TouchableOpacity onPress={handleViewAllPress}>
        <Text style={styles.seeAllText}>View All</Text>
      </TouchableOpacity>
    </View>
  )
}

export const UpcomingAppointmentCard = ({item}) => {
  const navigation = useNavigation()

  const handleCardPress = () => {
    navigation.navigate('AppointmentOverview', {appointmentData: item})
  }

  return (
    <Touchable onPress={handleCardPress}>
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
            style={[
              styles.appointmentDateContainer,
              {backgroundColor: '#E4E4E4'},
            ]}>
            <View style={styles.leftAlign}>
              <Ionicons name="ios-calendar" size={20} color="#000000" />
              <Text style={[styles.appointmentDate, {color: '#000000'}]}>
                {item.date}
              </Text>
            </View>
            <Text
              style={{
                color: '#000000',
                alignSelf: 'center',
                marginHorizontal: 10,
              }}>
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
    </Touchable>
  )
}

const StatsCard = ({iconName, value, label}) => {
  return (
    <View style={styles.statsCard}>
      <Ionicons name={iconName} size={24} style={styles.statsIcon} />
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsLabel}>{label}</Text>
    </View>
  )
}

const RecentAppointmentItem = ({item}) => {
  const fullStars = Math.floor(item.rating)
  const hasHalfStar = item.rating - fullStars > 0

  return (
    <View style={styles.recentAppointmentContainer}>
      <Image source={item.image} style={styles.recentPatientImage} />
      <View style={styles.recentInfoContainer}>
        <Text style={styles.recentPatientName}>{item.name}</Text>
        <Text style={styles.recentAppointmentType}>{item.type}</Text>
        <Text style={styles.recentAppointmentDate}>
          {item.date} | {item.time}
        </Text>
        <View style={styles.recentRatingContainer}>
          {/* Display full stars */}
          {Array.from({length: fullStars}).map((_, index) => (
            <Ionicons key={index} name="ios-star" size={20} color="#1069AD" />
          ))}
          {/* Display half star if needed */}
          {hasHalfStar && (
            <Ionicons name="ios-star-half" size={20} color="#1069AD" />
          )}
          {/* Display empty stars */}
          {Array.from({length: 5 - fullStars - (hasHalfStar ? 1 : 0)}).map(
            (_, index) => (
              <Ionicons
                key={`empty-${index}`}
                name="ios-star-outline"
                size={20}
                color="#1069AD"
              />
            ),
          )}
          <Text style={styles.recentReviewCount}>({item.reviews} reviews)</Text>
        </View>
      </View>
      <Ionicons
        name="ios-chatbubbles"
        size={24}
        color="#1069AD"
        style={styles.recentMessageIcon}
      />
    </View>
  )
}

export const UPCOMING_SCHEDULE_DATA = [
  {
    id: '1',
    name: 'Sara Jones',
    type: 'Regular Checkup',
    date: 'Friday, 15 Sept',
    time: '09:00 - 10:00',
    image: require('./assets/images/head-4.jpg'),
    rating: 4.3, // Added rating
    reviews: 20, // example review count
  },
  {
    id: '2',
    name: 'Jonathan Brister',
    type: 'Dental Cleaning',
    date: 'Saturday, 16 Sept',
    time: '11:00 - 12:00',
    image: require('./assets/images/pat-1.jpeg'),
    rating: 5, // Added rating
    reviews: 4, // example review count
  },
  {
    id: '3',
    name: 'Mike Smith',
    type: 'Eye Checkup',
    date: 'Sunday, 17 Sept',
    time: '14:00 - 15:00',
    image: require('./assets/images/pat-2.jpeg'),
    rating: 3.9, // Added rating
    reviews: 25, // example review count
  },
]

export const RECENT_APPOINTMENTS_DATA = [
  {
    id: '1',
    name: 'Josephine Costanza',
    type: 'Eye Checkup',
    date: 'Monday, 11 Sept',
    time: '14:00 - 15:00',
    image: require('./assets/images/pat-4.jpeg'),
    rating: 4.5,
    reviews: 20,
  },
  {
    id: '2',
    name: 'Mike Shinoda',
    type: 'Physical Examination',
    date: 'Sunday, 11 Sept',
    time: '11:00 - 12:00',
    image: require('./assets/images/pat-5.jpeg'),
    rating: 4.0,
    reviews: 15,
  },

  {
    id: '4',
    name: 'Jessica Parker',
    type: 'Medicine Update',
    date: 'Sunday, 10 Sept',
    time: '11:00 - 12:00',
    image: require('./assets/images/pat-3.jpeg'),
    rating: 4.3,
    reviews: 30,
  },
  {
    id: '5',
    name: 'Ishan Kishan',
    type: 'Urgent Care',
    date: 'Tuesday, 8 Sept',
    time: '9:00 - 10:00',
    image: require('./assets/images/pat-6.jpeg'),
    rating: 4.5,
    reviews: 35,
  },
]
;<UpcomingScheduleHeader count={UPCOMING_SCHEDULE_DATA.length} />

const DoctorDashboardContent = () => {
  const flatListRef = useRef(null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isUserInteracting, setIsUserInteracting] = useState(false)

  useEffect(() => {
    if (!isUserInteracting) {
      const slideShowInterval = setInterval(() => {
        if (currentSlideIndex < UPCOMING_SCHEDULE_DATA.length - 1) {
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

  const CarouselIndicator = ({total, activeIndex}) => {
    return (
      <View style={styles.indicatorContainer}>
        {Array.from({length: total}).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    )
  }

  return (
    <ScrollView style={styles.dashboardContainer}>
      <SearchBar />
      <UpcomingScheduleHeader count={UPCOMING_SCHEDULE_DATA.length} />
      <FlatList
        style={{marginBottom: 10}}
        ref={flatListRef}
        data={UPCOMING_SCHEDULE_DATA}
        horizontal
        pagingEnabled
        contentContainerStyle={{
          width: `${100 * UPCOMING_SCHEDULE_DATA.length}%`,
        }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={{width: SCREEN_WIDTH}}>
            <UpcomingAppointmentCard item={item} />
          </View>
        )}
        onScrollBeginDrag={() => setIsUserInteracting(true)}
        onScrollEndDrag={() => setIsUserInteracting(false)}
        onMomentumScrollEnd={event => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
          )
          setCurrentSlideIndex(newIndex)
        }}
      />
      <CarouselIndicator
        total={UPCOMING_SCHEDULE_DATA.length}
        activeIndex={currentSlideIndex}
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
      <View style={styles.recentAppointmentsHeader}>
        <Text style={styles.recentAppointmentsTitle}>Recent Appointments</Text>
      </View>
      {RECENT_APPOINTMENTS_DATA.map(item => (
        <RecentAppointmentItem key={item.id} item={item} />
      ))}
      <View style={styles.bottomSpacer}></View>
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
    marginLeft: 150,
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
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#1069AD',
  },
  inactiveDot: {
    backgroundColor: '#d3d3d3',
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
  recentAppointmentsHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
    marginTop: -20,
  },
  recentAppointmentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recentAppointmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
  },
  recentPatientImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  recentInfoContainer: {
    flex: 1,
  },
  recentPatientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recentAppointmentType: {
    fontSize: 14,
    color: '#888',
  },
  recentAppointmentDate: {
    fontSize: 12,
    color: '#aaa',
  },
  recentRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  recentReviewCount: {
    marginLeft: 5,
    fontSize: 12,
    color: '#888',
  },
  recentMessageIcon: {
    marginLeft: 15,
  },
  bottomSpacer: {
    height: 75, // adjust this value based on the height of your bottom tabs
  },
})

export default HomeTab
