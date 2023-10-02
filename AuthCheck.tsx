import React from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { NavigationContext } from './NavigationContext'

export default function AuthCheck({ RenderComponent, ...rest }) {
  const navigatorContext = React.useContext(NavigationContext)

  const navigator = navigatorContext.navigator

  if (!firebase.auth().currentUser) {
    return null
  }

  return <RenderComponent {...rest} />
}
