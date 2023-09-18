import React, { useEffect, useRef, useState } from 'react'
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
  Modal,
} from 'react-native'
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'

const SCREEN_WIDTH = Dimensions.get('window').width

const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(today.getDate() + 1)

export const UPCOMING_SCHEDULE_DATA = [
  {
    id: '1',
    name: 'Sara Jones',
    type: 'Regular Checkup',
    date: '2023-09-17',
    time: '09:00 - 10:00',
    image: require('./assets/images/head-4.jpg'),
    rating: 4.3, // Added rating
    reviews: 20, // example review count
  },
  {
    id: '2',
    name: 'Jonathan Brister',
    type: 'Dental Cleaning',
    date: '2023-09-17',
    time: '11:00 - 12:00',
    image: require('./assets/images/pat-1.jpeg'),
    rating: 5, // Added rating
    reviews: 4, // example review count
  },
  {
    id: '3',
    name: 'Mike Smith',
    type: 'Eye Checkup',
    date: '2023-09-17',
    time: '14:00 - 15:00',
    image: require('./assets/images/pat-2.jpeg'),
    rating: 3.9, // Added rating
    reviews: 25, // example review count
  },
  {
    id: '4',
    name: 'Norman Osborne',
    type: 'Eye Checkup',
    date: '2023-09-17',
    time: '15:00 - 16:00',
    image: require('./assets/images/pat-2.jpeg'),
    rating: 3.9, // Added rating
    reviews: 25, // example review count
  },
  {
    id: '5',
    name: 'Janet Harwood',
    type: 'Physical Exam',
    date: `2023-09-19`,
    time: '10:00 - 11:00',
    image: require('./assets/images/head-3.jpg'),
    rating: 4.5,
    reviews: 10,
  },
  {
    id: '6',
    name: 'Serena Costanza',
    type: 'Oral Examination',
    date: '2023-09-18',
    time: '11:00 - 12:00',
    image: require('./assets/images/pat-3.jpeg'),
    rating: 4.5, // Added rating
    reviews: 25, // example review count
  },
  {
    id: '7',
    name: 'Juliana Carpenter',
    type: 'Dental Cleaning',
    date: '2023-09-18',
    time: '13:00 - 14:00',
    image: require('./assets/images/head-2.jpg'),
    rating: 4, // Added rating
    reviews: 12, // example review count
  },
  {
    id: '8',
    name: 'Michael Phelps',
    type: 'Monthly Checkup',
    date: '2023-09-19',
    time: '09:00 - 10:00',
    image: require('./assets/images/pat-7.jpeg'),
    rating: 4.7, // Added rating
    reviews: 35, // example review count
  },
  {
    id: '9',
    name: 'Gina Schultz',
    type: 'Physical Exam',
    date: '2023-09-19',
    time: '11:00 - 12:00',
    image: require('./assets/images/pat-4.jpeg'),
    rating: 4.6, // Added rating
    reviews: 24, // example review count
  },
  {
    id: '10',
    name: 'Serena Costanza',
    type: 'Physical Exam',
    date: '2023-09-20',
    time: '10:00 - 11:00',
    image: require('./assets/images/pat-3.jpeg'),
    rating: 3.9, // Added rating
    reviews: 42, // example review count
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

const Touchable = ({ children, style, ...props }) => {
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
    <TouchableHighlight {...props} underlayColor='#adadad' style={style}>
      {children}
    </TouchableHighlight>
  )
}

const SearchBar = () => (
  <View style={styles.searchBarContainer}>
    <Ionicons name='ios-search' size={20} color='#888' />
    <TextInput placeholder='Search...' style={styles.searchInput} />
  </View>
)

const VerticalStatusPill = ({ day, date, isActive }) => {
  const backgroundColor = isActive ? '#1069AD' : 'rgba(255, 255, 255, 0.8)'
  const textColor = isActive ? '#fff' : '#000'

  return (
    <View
      style={{
        ...styles.statusPillContainer,
        backgroundColor: backgroundColor,
      }}>
      <Text style={{ ...styles.statusPillDay, color: textColor }}>{day}</Text>
      <Text style={{ ...styles.statusPillDate, color: textColor }}>{date}</Text>
    </View>
  )
}

const AppointmentTimelineTab = () => {
  const startDate = new Date(2023, 8, 18)
  const filterOptions = [
    { label: 'This week', value: 'this_week' },
    { label: 'Previous week', value: 'prev_week' },
    { label: 'Next week', value: 'next_week' },
  ]

  const [selectedFilter, setSelectedFilter] = useState('this_week')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [selectedDay, setSelectedDay] = useState(new Date().getDay())

  const calculateDaysAndDates = filter => {
    const now = new Date()
    const days = []
    const dates = []

    let startDate = new Date(now) // Starting with the current date
    startDate.setDate(now.getDate() - now.getDay()) // Adjusting to the Sunday of the current week

    switch (filter) {
      case 'this_week':
        for (let i = 0; i < 7; i++) {
          const date = new Date(startDate)
          date.setDate(startDate.getDate() + i)
          days.push(
            date.toLocaleString('en-us', { weekday: 'short' }).substring(0, 1),
          )
          dates.push(date.getDate().toString().padStart(2, '0'))
        }
        break
      case 'prev_week':
        startDate.setDate(startDate.getDate() - 7)
        for (let i = 0; i < 7; i++) {
          const date = new Date(startDate)
          date.setDate(startDate.getDate() + i)
          days.push(
            date.toLocaleString('en-us', { weekday: 'short' }).substring(0, 1),
          )
          dates.push(date.getDate().toString().padStart(2, '0'))
        }
        break
      case 'next_week':
        startDate.setDate(startDate.getDate() + 7)
        for (let i = 0; i < 7; i++) {
          const date = new Date(startDate)
          date.setDate(startDate.getDate() + i)
          days.push(
            date.toLocaleString('en-us', { weekday: 'short' }).substring(0, 1),
          )
          dates.push(date.getDate().toString().padStart(2, '0'))
        }
        break
    }

    return { days, dates }
  }

  const { days, dates } = calculateDaysAndDates(selectedFilter)

  const now = new Date()

  let year = now.getFullYear()
  let month = now.getMonth()

  // Adjust the year and month based on the selected filter
  switch (selectedFilter) {
    case 'prev_week':
      if (now.getDate() - now.getDay() < 7) {
        month = month - 1
        if (month < 0) {
          month = 11
          year = year - 1
        }
      }
      break
    case 'next_week':
      if (
        now.getDate() + (6 - now.getDay()) >=
        new Date(year, month + 1, 0).getDate()
      ) {
        month = month + 1
        if (month > 11) {
          month = 0
          year = year + 1
        }
      }
      break
    default:
      // 'this_week' doesn't require any adjustment
      break
  }

  const filteredAppointments = UPCOMING_SCHEDULE_DATA.filter(appointment => {
    const dateParts = appointment.date
      .split('-')
      .map(part => parseInt(part, 10))

    // No need to set hours, minutes, and seconds
    const appointmentDate = new Date(
      dateParts[0],
      dateParts[1] - 1,
      dateParts[2],
    )

    // Use the selectedDay to retrieve the date from the dates array
    const selectedDateString = dates[selectedDay]
    const selectedFullDate = new Date(year, month, parseInt(selectedDateString))

    return (
      appointmentDate.getDate() === selectedFullDate.getDate() &&
      appointmentDate.getMonth() === selectedFullDate.getMonth() &&
      appointmentDate.getFullYear() === selectedFullDate.getFullYear()
    )
  })

  const isDayActive = (day, date) => {
    const now = new Date()
    return (
      day ===
        now.toLocaleString('en-us', { weekday: 'short' }).substring(0, 1) &&
      parseInt(date) === now.getDate()
    )
  }

  const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <View style={styles.appointmentTimelineContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.appointmentTimelineHeader}>
          Appointment Timeline
        </Text>
        <TouchableOpacity onPress={() => setShowFilterModal(true)}>
          <View style={styles.filterPill}>
            <Text style={{ ...styles.filterText, marginTop: -1 }}>
              {filterOptions.find(option => option.value === selectedFilter)
                ?.label || ''}
            </Text>
            <Text style={{ ...styles.filterSeparator, marginTop: -4 }}>|</Text>
            <MaterialIcons
              name='keyboard-arrow-down'
              color='black'
              size={24}
              style={{ ...styles.filterIcon, marginTop: -4 }}
            />
          </View>
        </TouchableOpacity>
        <Modal
          transparent={true}
          animationType='slide'
          visible={showFilterModal}
          onRequestClose={() => setShowFilterModal(false)}>
          <View style={styles.filterModal}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFilterModal(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            {filterOptions.map(
              option =>
                option.value !== selectedFilter && (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.filterOption}
                    onPress={() => {
                      setSelectedFilter(option.value)
                      setShowFilterModal(false)
                    }}>
                    <Text style={styles.filterOptionText}>{option.label}</Text>
                  </TouchableOpacity>
                ),
            )}
          </View>
        </Modal>
      </View>

      {/* Clickable Day/Date pills */}
      <View style={styles.pillContainer}>
        {DAYS.map((day, index) => {
          const currentDayIndex = new Date().getDay()
          const isActiveDay = currentDayIndex === index
          const isSelectedDay = selectedDay === index

          const backgroundColor = isActiveDay ? '#1069AD' : '#fff'
          const textColor = isActiveDay
            ? '#fff'
            : isSelectedDay
            ? '#1069AD'
            : '#000'
          const borderColor = isSelectedDay ? '#1069AD' : 'transparent'

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.statusPillContainer,
                { backgroundColor, borderColor, borderWidth: 1 },
              ]}
              onPress={() => setSelectedDay(index)}>
              <Text style={[styles.statusPillDay, { color: textColor }]}>
                {day}
              </Text>
              <Text style={[styles.statusPillDate, { color: textColor }]}>
                {dates[index]}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <View style={styles.newSectionContainer}>
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(appointment => {
            const isPast =
              new Date(
                appointment.date + 'T' + appointment.time.split('-')[0].trim(),
              ) < new Date()

            return (
              <React.Fragment key={appointment.id}>
                <View style={styles.appointmentContainer}>
                  {/* Arrow Icons Container */}
                  <View style={styles.arrowContainer}>
                    {isPast ? (
                      <Ionicons
                        name='ios-chevron-down-circle'
                        size={24}
                        color='#1069AD'
                      />
                    ) : (
                      <Ionicons
                        name='ios-chevron-down-circle-outline'
                        size={24}
                        color='#1069AD'
                      />
                    )}
                  </View>

                  {/* Appointment Time Container */}
                  <View style={styles.timeContainer}>
                    <Text style={styles.appointmentTimeNew}>
                      {appointment.time}
                    </Text>
                  </View>

                  {/* Vertical Dotted Line Container */}
                  <View style={styles.verticalDotsContainer}>
                    {Array(9)
                      .fill(0)
                      .map((_, index) => (
                        <Text key={index} style={styles.dot}>
                          .
                        </Text>
                      ))}
                  </View>
                </View>

                <View style={styles.pillContainer2}>
                  <Image source={appointment.image} style={styles.avatar} />
                  <View style={styles.appointmentTextContainer}>
                    <Text style={styles.appointmentNameNew}>
                      {appointment.name}
                    </Text>
                    <Text style={styles.appointmentTypeNew}>
                      {appointment.type}
                    </Text>
                  </View>
                </View>
              </React.Fragment>
            )
          })
        ) : (
          <Text style={styles.emptyText}>No new appointments booked yet!</Text>
        )}
      </View>
    </View>
  )
}

const UpcomingScheduleHeader = ({ count }) => {
  const navigation = useNavigation()

  const handleViewAllPress = () => {
    navigation.navigate('AppointmentList')
  }

  return (
    <View style={styles.upcomingScheduleHeader}>
      <Text style={styles.upcomingText}>Upcoming Appointments</Text>
      <View style={styles.countCircle}>
        <Text style={styles.countText}>{count}</Text>
      </View>
      <TouchableOpacity onPress={handleViewAllPress}>
        <Text style={styles.seeAllText}>View All</Text>
      </TouchableOpacity>
    </View>
  )
}

export const UpcomingAppointmentCard = ({ item }) => {
  const navigation = useNavigation()

  const handleCardPress = () => {
    navigation.navigate('AppointmentOverview', { appointmentData: item })
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
              <Text style={[styles.patientName, { color: '#FFFFFF' }]}>
                {item.name}
              </Text>
              <Text style={[styles.appointmentType, { color: '#FFFFFF' }]}>
                {item.type}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons
                name='ios-videocam'
                size={24}
                color='#FFFFFF'
                style={[styles.icon, styles.icon3D]}
              />
              <Ionicons
                name='ios-chatbubbles'
                size={24}
                color='#FFFFFF'
                style={styles.icon3D}
              />
            </View>
          </View>
          <View
            style={[
              styles.appointmentDateContainer,
              { backgroundColor: '#E4E4E4' },
            ]}>
            <View style={styles.leftAlign}>
              <Ionicons name='ios-calendar' size={20} color='#000000' />
              <Text style={[styles.appointmentDate, { color: '#000000' }]}>
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
                name='ios-time'
                size={20}
                color='#000000'
                style={styles.icon}
              />
              <Text style={[styles.appointmentTime, { color: '#000000' }]}>
                {item.time}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Touchable>
  )
}
;<UpcomingScheduleHeader count={UPCOMING_SCHEDULE_DATA.length} />

const StatsCard = ({ iconName, value, label }) => {
  return (
    <View style={styles.statsCard}>
      <Ionicons name={iconName} size={24} style={styles.statsIcon} />
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsLabel}>{label}</Text>
    </View>
  )
}

const RecentAppointmentItem = ({ item }) => {
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
          {Array.from({ length: fullStars }).map((_, index) => (
            <Ionicons key={index} name='ios-star' size={20} color='#1069AD' />
          ))}
          {/* Display half star if needed */}
          {hasHalfStar && (
            <Ionicons name='ios-star-half' size={20} color='#1069AD' />
          )}
          {/* Display empty stars */}
          {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map(
            (_, index) => (
              <Ionicons
                key={fullStars + index}
                name='ios-star-outline'
                size={20}
                color='#1069AD'
              />
            ),
          )}
          <Text style={styles.recentReviewCount}>({item.reviews} reviews)</Text>
        </View>
      </View>
      <Ionicons
        name='ios-chatbubbles'
        size={24}
        color='#1069AD'
        style={styles.recentMessageIcon}
      />
    </View>
  )
}

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

  const CarouselIndicator = ({ total, activeIndex }) => {
    return (
      <View style={styles.indicatorContainer}>
        {Array.from({ length: total }).map((_, index) => (
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

  const [upcomingAppointments, setUpcomingAppointments] = useState([])

  useEffect(() => {
    // Get current date and time
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinutes = now.getMinutes()

    // Filter UPCOMING_SCHEDULE_DATA to get only upcoming appointments
    const filteredAppointments = UPCOMING_SCHEDULE_DATA.filter(appointment => {
      const appointmentDate = new Date(appointment.date)
      if (appointmentDate > now) {
        // If the appointment date is in the future, include it
        return true
      } else if (appointmentDate.toDateString() === now.toDateString()) {
        // If the appointment is today, check the time
        const [startHour, startMinutes] = appointment.time
          .split(' - ')[0]
          .split(':')
          .map(Number)
        return (
          startHour > currentHour ||
          (startHour === currentHour && startMinutes > currentMinutes)
        )
      }
      return false
    })

    setUpcomingAppointments(filteredAppointments)
  }, [])

  return (
    <ScrollView style={styles.dashboardContainer}>
      <SearchBar />
      <AppointmentTimelineTab />
      <UpcomingScheduleHeader count={upcomingAppointments.length} />
      <FlatList
        data={upcomingAppointments}
        keyExtractor={item => item.id}
        style={{ marginBottom: 10 }}
        ref={flatListRef}
        horizontal
        pagingEnabled
        contentContainerStyle={{
          width: `${100 * upcomingAppointments.length}%`,
        }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_WIDTH }}>
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
          <MaterialCommunityIcons name='refresh' size={24} color='#1069AD' />
        </TouchableOpacity>
      </View>
      <View style={styles.statsGrid}>
        <StatsCard iconName='ios-people' value='15' label='Patients' />
        <StatsCard iconName='ios-document' value='7' label='Prescriptions' />
        <StatsCard iconName='ios-call' value='3' label='ER Calls' />
        <StatsCard iconName='ios-time' value='2' label='Appointments' />
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
    borderRadius: 50,
    margin: 10,
    alignItems: 'center',
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
  },
  appointmentTimelineContainer: {
    marginBottom: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  appointmentTimelineHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  statusPillContainer: {
    width: (SCREEN_WIDTH - 2 * 30 - 6 * 5) / 7,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: 5,
    flexDirection: 'column',
  },
  statusPillDay: {
    fontWeight: 'bold',
    marginBottom: 2.5,
  },
  statusPillDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2.5,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 15,
    padding: 5,
    marginRight: 5,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 15,
    padding: 5,
    paddingRight: 1,
    paddingLeft: 10,
    marginRight: -5,
    height: 25,
  },
  filterText: {
    marginRight: 5,
  },
  filterModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterOption: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
  },
  filterOptionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1069AD',
  },
  filterIcon: {
    marginLeft: 1, // Push the icon 1 pixel to the right
  },
  filterSeparatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -3 }], // Adjust as needed for spacing
  },
  filterSeparator: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#CCCCCC',
    marginBottom: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1069AD',
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
    marginLeft: 110,
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
  newSectionContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#E4E4E4',
    padding: 10,
  },

  appointmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Change flex-start to space-between
    position: 'relative',
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  arrowContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 20,
    marginLeft: -240,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 20,
    marginLeft: -240,
  },

  verticalDotsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 75,
    position: 'relative', // Set to relative
    top: 27.5, // Adjust this value to move all the dots down together
    marginLeft: -258,
  },

  pillContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    marginTop: -60,
    marginLeft: 10,
    width: 330,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  pillsContainer3: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingRight: 10,
    marginBottom: 100,
    marginLeft: 50,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  horizontalDotsRightContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  dot: {
    backgroundColor: '#1069AD',
    borderRadius: 50,
    width: 3,
    height: 4,
    margin: 2,
    marginRight: 195,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  appointmentTextContainer: {
    flexDirection: 'column',
    marginLeft: 5,
  },

  appointmentTimeNew: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },

  appointmentNameNew: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#1069AD',
  },

  appointmentTypeNew: {
    fontSize: 13,
  },
  daysContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  dayPill1: {
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeDayPill1: {
    backgroundColor: '#1069AD',
  },

  dayPillText1: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  daysContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  dayPill2: {
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeDayPill2: {
    backgroundColor: '#1069AD',
  },

  dayPillText2: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  dot2: {
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
  emptyText: {
    color: '#1069AD',
    marginTop: 10,
    marginBottom: -10,
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
    shadowOffset: { width: 1, height: 2 },
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
    shadowOffset: { width: 2, height: 2 },
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
