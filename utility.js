import firebase from 'firebase/compat/app'
import 'firebase/compat/database'

export const getAppointments = async () => {
  try {
    const appointmentRef = firebase.database().ref('appointments')
    const snapshot = await appointmentRef.once('value')

    if (snapshot.exists()) {
      const appointments = Object.values(snapshot.val())

      // Sort appointments by date and time
      appointments.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time.split(' - ')[0])
        const dateB = new Date(b.date + ' ' + b.time.split(' - ')[0])
        return dateA.getTime() - dateB.getTime()
      })

      return { success: true, data: appointments }
    } else {
      throw new Error('No appointments found.')
    }
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return {
      success: false,
      error: error.message || 'Unable to fetch appointments.',
    }
  }
}
