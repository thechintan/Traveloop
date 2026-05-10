import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Plus, MapPin, Calendar, Clock, Navigation, PieChart as PieChartIcon, Luggage, FileText, Share2 } from 'lucide-react-native';
import api from '../api/config';
import { COLORS, SIZES } from '../theme/colors';

const ItineraryBuilderScreen = ({ route, navigation }) => {
  const { tripId } = route.params || {};
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStops = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/stops/trip/${tripId}`);
      setStops(response.data);
    } catch (error) {
      console.log('Error fetching stops:', error);
      Alert.alert('Error', 'Failed to load itinerary stops');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (tripId) fetchStops();
    }, [tripId])
  );

  const renderActivity = (activity) => (
    <View key={activity.id} style={styles.activityItem}>
      <View style={styles.activityDot} />
      <View style={styles.activityContent}>
        <Text style={styles.activityName}>{activity.name}</Text>
        <View style={styles.activityMeta}>
          <Clock size={12} color={COLORS.textSecondary} />
          <Text style={styles.activityMetaText}>{activity.duration_hours} hrs</Text>
          <Text style={styles.activityMetaText}>• ${activity.estimated_cost}</Text>
        </View>
      </View>
    </View>
  );

  const renderStop = ({ item, index }) => (
    <View style={styles.stopCard}>
      <View style={styles.stopHeader}>
        <View style={styles.stopNumberBadge}>
          <Text style={styles.stopNumber}>{index + 1}</Text>
        </View>
        <View style={styles.stopTitleContainer}>
          <Text style={styles.stopCity}>{item.city_name}</Text>
          <Text style={styles.stopDates}>
            {item.arrival_date ? new Date(item.arrival_date).toLocaleDateString() : 'TBD'} - 
            {item.departure_date ? new Date(item.departure_date).toLocaleDateString() : 'TBD'}
          </Text>
        </View>
      </View>

      <View style={styles.activitiesContainer}>
        <Text style={styles.sectionTitle}>Activities</Text>
        {item.activities && item.activities.length > 0 ? (
          item.activities.map(renderActivity)
        ) : (
          <Text style={styles.emptyActivitiesText}>No activities planned yet.</Text>
        )}
        
        <TouchableOpacity 
          style={styles.addActivityBtn}
          onPress={() => navigation.navigate('Explore', { selectMode: true, stopId: item.id })}
        >
          <Plus size={16} color={COLORS.primary} />
          <Text style={styles.addActivityText}>Add Activity</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!tripId) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No trip selected</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Itinerary Builder</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Budget', { tripId })}>
            <PieChartIcon color={COLORS.text} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Packing', { tripId })}>
            <Luggage color={COLORS.text} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('TripNotes', { tripId })}>
            <FileText color={COLORS.text} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('SharedItinerary', { tripId })}>
            <Share2 color={COLORS.text} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={stops}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderStop}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Navigation color={COLORS.textMuted} size={40} />
              <Text style={styles.emptyStateText}>Your itinerary is empty</Text>
              <Text style={styles.emptyStateSub}>Add your first destination to get started.</Text>
            </View>
          }
          ListFooterComponent={
            <TouchableOpacity 
              style={styles.addStopButton}
              onPress={() => navigation.navigate('Explore', { selectMode: true, returnTo: 'ItineraryBuilder', type: 'city', tripId })}
            >
              <Plus color={COLORS.white} size={20} />
              <Text style={styles.addStopButtonText}>Add Destination</Text>
            </TouchableOpacity>
          }
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    backgroundColor: COLORS.surface,
    padding: 8,
    borderRadius: SIZES.radius,
    marginLeft: 8,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  stopCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  stopHeader: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  stopNumberBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stopNumber: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  stopTitleContainer: {
    flex: 1,
  },
  stopCity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  stopDates: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  activitiesContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityName: {
    color: COLORS.text,
    fontSize: 15,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  activityMetaText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 4,
  },
  emptyActivitiesText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  addActivityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingVertical: 5,
  },
  addActivityText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  addStopButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: SIZES.radius,
    marginTop: 10,
  },
  addStopButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  emptyStateSub: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 5,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
    marginTop: 50,
  }
});

export default ItineraryBuilderScreen;
