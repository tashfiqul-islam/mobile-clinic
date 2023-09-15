import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DoctorDashboard from './DoctorDashboard';
import ChatScreen from './ChatScreen'; // Make sure to import ChatScreen if it's in a separate file.

const DoctorDashboardStack = createStackNavigator();

const DoctorDashboardNavigator = () => {
  return (
    <DoctorDashboardStack.Navigator initialRouteName="DashboardTabs" screenOptions={{ headerShown: false }}>
      <DoctorDashboardStack.Screen name="DashboardTabs" component={DoctorDashboard} />
      <DoctorDashboardStack.Screen name="ChatScreen" component={ChatScreen} />
    </DoctorDashboardStack.Navigator>
  );
};

export default DoctorDashboardNavigator;
