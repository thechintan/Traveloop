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
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
