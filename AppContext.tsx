import React from 'react'

export const AppContext = React.createContext({
  users: [],
  setUsers: (value): Fn => {},
  isUsersLoaded: false,
  setUsersLoaded: (value): Fn => {},
})
