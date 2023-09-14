import React from 'react'
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

const Spacer = () => <View style={styles.spacer} />

const Touchable = ({children, style, ...props}) => {
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    return (
      <TouchableNativeFeedback
        {...props}
        useForeground
        background={TouchableNativeFeedback.Ripple('#80adadad', false)}>
        <View style={[style, {backgroundColor: '#E4E4E4'}]}>{children}</View>
      </TouchableNativeFeedback>
    )
  }
  return (
    <TouchableHighlight {...props} underlayColor="#adadad" style={style}>
      {children}
    </TouchableHighlight>
  )
}

const HeaderWithCount = ({title, count}) => (
  <View style={styles.headerWithCountContainer}>
    <Text style={styles.headerText}>{title}</Text>
    <View style={styles.countCircle}>
      <Text style={styles.countText}>{count}</Text>
    </View>
  </View>
)

const AppointmentList = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#E4E4E4'}}>
      <ScrollView style={styles.container}>
        <HeaderWithCount
          title="Upcoming Appointments"
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

        <HeaderWithCount
          title="Recent Appointments"
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
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
    marginLeft: 0,
    marginTop: 10,
  },
  recentHeaderSpacing: {
    marginTop: 20,
  },
  cardSpacing: {
    marginBottom: 10,
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
  spacer: {
    height: 75, // height of the bottom tabs 
  },
})

export default AppointmentList
