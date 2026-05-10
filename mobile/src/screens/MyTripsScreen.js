import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, MapPin, Compass } from 'lucide-react-native';
import api from '../api/config';
import { COLORS, SIZES } from '../theme/colors';

const MyTripsScreen = ({ navigation }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    try {
      const response = await api.get('/api/trips');
      setTrips(response.data);
    } catch (error) {
      console.log('Failed to fetch trips', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [])
  );

  const renderTrip = ({ item }) => (
    <TouchableOpacity 
      style={styles.tripCard}
      onPress={() => navigation.navigate('ItineraryBuilder', { tripId: item.id })}
    >
      <Image 
        source={{ uri: item.cover_image || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop' }} 
        style={styles.tripImage} 
      />
      <View style={styles.tripContent}>
        <Text style={styles.tripName}>{item.name}</Text>
        <View style={styles.tripMeta}>
          <Calendar size={14} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>
            {item.start_date ? new Date(item.start_date).toLocaleDateString() : 'Dates TBD'}
          </Text>
        </View>
        <View style={styles.tripMeta}>
          <MapPin size={14} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>{item.stop_count || 0} Stops</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : trips.length === 0 ? (
        <View style={styles.emptyState}>
          <Compass color={COLORS.textMuted} size={50} />
          <Text style={styles.emptyText}>No trips planned yet</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateTrip')}
          >
            <Text style={styles.createButtonText}>Create New Trip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTrip}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  listContainer: {
    padding: 20,
  },
  tripCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tripImage: {
    width: '100%',
    height: 150,
    backgroundColor: COLORS.surface,
  },
  tripContent: {
    padding: 15,
  },
  tripName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  tripMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    marginTop: 15,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
  },
  createButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default MyTripsScreen;
