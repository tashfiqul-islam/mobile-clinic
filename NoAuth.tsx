import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

export default function NoAuth({ children }) {
  if (!firebase.auth().currentUser) {
    return children
  }

  return null
}
