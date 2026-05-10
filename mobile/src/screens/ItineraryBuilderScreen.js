import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

const ItineraryBuilderScreen = ({ route }) => {
  const { tripId } = route.params || {};
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Itinerary Builder for Trip {tripId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: COLORS.text,
    fontSize: 18,
  }
});

export default ItineraryBuilderScreen;
