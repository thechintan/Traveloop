import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import { COLORS } from '../theme/colors';

// Additional screens that are not tabs
import CreateTripScreen from '../screens/CreateTripScreen';
import ItineraryBuilderScreen from '../screens/ItineraryBuilderScreen';
import BudgetScreen from '../screens/BudgetScreen';
import PackingScreen from '../screens/PackingScreen';
import TripNotesScreen from '../screens/TripNotesScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import SharedItineraryScreen from '../screens/SharedItineraryScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen 
            name="CreateTrip" 
            component={CreateTripScreen} 
            options={{ 
              headerShown: true, 
              title: 'New Trip',
              headerStyle: { backgroundColor: COLORS.card },
              headerTintColor: COLORS.text 
            }} 
          />
          <Stack.Screen 
            name="ItineraryBuilder" 
            component={ItineraryBuilderScreen} 
            options={{ 
              headerShown: true, 
              title: 'Itinerary Builder',
              headerStyle: { backgroundColor: COLORS.card },
              headerTintColor: COLORS.text 
            }} 
          />
          <Stack.Screen 
            name="Budget" 
            component={BudgetScreen} 
            options={{ 
              headerShown: true, 
              title: 'Budget Breakdown',
              headerStyle: { backgroundColor: COLORS.card },
              headerTintColor: COLORS.text 
            }} 
          />
          <Stack.Screen 
            name="Packing" 
            component={PackingScreen} 
            options={{ 
              headerShown: true, 
              title: 'Packing Checklist',
              headerStyle: { backgroundColor: COLORS.card },
              headerTintColor: COLORS.text 
            }} 
          />
          <Stack.Screen 
            name="TripNotes" 
            component={TripNotesScreen} 
            options={{ 
              headerShown: true, 
              title: 'Trip Journal',
              headerStyle: { backgroundColor: COLORS.card },
              headerTintColor: COLORS.text 
            }} 
          />
          <Stack.Screen 
            name="AdminDashboard" 
            component={AdminDashboardScreen} 
            options={{ 
              headerShown: true, 
              title: 'Admin Analytics',
              headerStyle: { backgroundColor: COLORS.card },
              headerTintColor: COLORS.text 
            }} 
          />
          <Stack.Screen 
            name="SharedItinerary" 
            component={SharedItineraryScreen} 
            options={{ 
              headerShown: true, 
              title: 'Public Itinerary',
              headerStyle: { backgroundColor: COLORS.card },
              headerTintColor: COLORS.text 
            }} 
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
