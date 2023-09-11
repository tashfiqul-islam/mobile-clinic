import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

const Footer: React.FC = () => {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>
        © {new Date().getFullYear()} Mobile Clinic v0.0.1. All rights reserved.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  footerContainer: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff', // You might want to set a background color
    borderTopWidth: 1, // Add a border at the top for separation
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerText: {
    fontSize: 12,
    color: 'grey',
  },
})

export default Footer
