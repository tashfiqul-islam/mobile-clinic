import React, { useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  View,
  SafeAreaView,
} from 'react-native'
import {
  UpcomingAppointmentCard,
  UPCOMING_SCHEDULE_DATA,
  RECENT_APPOINTMENTS_DATA,
} from './HomeTab'
import { MaterialIcons } from '@expo/vector-icons'

const Spacer = () => <View style={styles.spacer} />

const Touchable = ({ children, style, ...props }) => {
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    return (
      <TouchableNativeFeedback
        {...props}
        useForeground
        background={TouchableNativeFeedback.Ripple('#80adadad', false)}>
        <View style={[style, { backgroundColor: '#E4E4E4' }]}>{children}</View>
      </TouchableNativeFeedback>
    )
  }
  return (
    <TouchableHighlight {...props} underlayColor='#adadad' style={style}>
      {children}
    </TouchableHighlight>
  )
}

const HeaderWithCount = ({ title, count }) => (
  <View style={styles.headerWithCountContainer}>
    <Text style={styles.headerText}>{title}</Text>
    <View style={styles.countCircle}>
      <Text style={styles.countText}>{count}</Text>
    </View>
  </View>
)

const AppointmentList = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Upcoming')

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E4E4E4' }}>
      <View style={styles.tabContainer}>
        <Touchable onPress={() => setSelectedTab('Upcoming')}>
          <View
            style={[
              styles.tab,
              selectedTab === 'Upcoming'
                ? styles.activeTabBackground
                : styles.inactiveTabBackground,
            ]}>
            <MaterialIcons
              name='event-note'
              size={24}
              color={selectedTab === 'Upcoming' ? '#FFF' : '#1069AD'}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === 'Upcoming'
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}>
              Upcoming
            </Text>
          </View>
        </Touchable>

        <Touchable onPress={() => setSelectedTab('Recent')}>
          <View
            style={[
              styles.tab,
              selectedTab === 'Recent'
                ? styles.activeTabBackground
                : styles.inactiveTabBackground,
            ]}>
            <MaterialIcons
              name='history'
              size={24}
              color={selectedTab === 'Recent' ? '#FFF' : '#1069AD'}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === 'Recent'
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}>
              Recent
            </Text>
          </View>
        </Touchable>
      </View>

      <ScrollView style={styles.container}>
        {selectedTab === 'Upcoming' && (
          <>
            <HeaderWithCount
              title='Upcoming Appointments'
              count={UPCOMING_SCHEDULE_DATA.length}
            />
            {UPCOMING_SCHEDULE_DATA.map((item, index) => (
              <Touchable
                key={item.id}
                onPress={() =>
                  navigation.navigate('AppointmentOverview', {
                    appointmentData: item,
                  })
                }
                style={
                  index !== UPCOMING_SCHEDULE_DATA.length - 1
                    ? styles.cardSpacing
                    : {}
                }>
                <UpcomingAppointmentCard item={item} />
              </Touchable>
            ))}
          </>
        )}

        {selectedTab === 'Recent' && (
          <>
            <HeaderWithCount
              title='Recent Appointments'
              count={RECENT_APPOINTMENTS_DATA.length}
            />
            {RECENT_APPOINTMENTS_DATA.map((item, index) => (
              <Touchable
                key={item.id}
                onPress={() =>
                  navigation.navigate('AppointmentOverview', {
                    appointmentData: item,
                  })
                }
                style={
                  index !== RECENT_APPOINTMENTS_DATA.length - 1
                    ? styles.cardSpacing
                    : {}
                }>
                <UpcomingAppointmentCard item={item} />
              </Touchable>
            ))}
          </>
        )}

        <Spacer />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4E4E4',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
    paddingHorizontal: 30,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginHorizontal: 5,
  },
  activeTabBackground: {
    backgroundColor: '#1069AD',
  },
  inactiveTabBackground: {
    backgroundColor: '#FFF',
  },
  tabText: {
    marginLeft: 10,
  },
  activeTabText: {
    color: '#FFF',
  },
  inactiveTabText: {
    color: '#1069AD',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
    marginLeft: 0,
    marginTop: 10,
  },
  headerWithCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 7.5,
    paddingHorizontal: 20,
  },
  countCircle: {
    backgroundColor: '#1069AD',
    borderRadius: 50,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  countText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cardSpacing: {
    marginBottom: 10,
  },
  spacer: {
    height: 75,
  },
})

export default AppointmentList
