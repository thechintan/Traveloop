import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Share, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Share2, Copy, MapPin } from 'lucide-react-native';
import api from '../api/config';
import { COLORS, SIZES } from '../theme/colors';

const SharedItineraryScreen = ({ route }) => {
  // In a real app this would take a shareCode param and fetch a public endpoint without auth
  const { tripId } = route.params || {};
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) {
      api.get(`/api/trips/${tripId}`)
        .then(res => setTripData(res.data))
        .catch(err => console.log('Error fetching shared trip', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [tripId]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my travel itinerary for ${tripData?.name} on Traveloop! Share Code: ${tripData?.share_code}`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCopy = () => {
    // In a real app, use Clipboard.setString
    Alert.alert('Copied!', 'Itinerary link copied to clipboard.');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  if (!tripData) return <SafeAreaView style={styles.container}><Text style={styles.errorText}>Trip not found or not public</Text></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shared Itinerary</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.tripName}>{tripData.name}</Text>
          <Text style={styles.tripDesc}>{tripData.description || 'A beautiful journey planned with Traveloop.'}</Text>
          
          <View style={styles.shareActions}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
              <Share2 color={COLORS.primary} size={20} />
              <Text style={styles.actionText}>Share Link</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleCopy}>
              <Copy color={COLORS.primary} size={20} />
              <Text style={styles.actionText}>Copy Trip</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Journey Timeline</Text>
        
        {tripData.stops?.map((stop, index) => (
          <View key={stop.id} style={styles.stopCard}>
            <View style={styles.stopHeader}>
              <MapPin color={COLORS.accent} size={20} />
              <Text style={styles.stopCity}>{stop.city_name}</Text>
            </View>
            <View style={styles.activitiesList}>
              {stop.activities?.map(act => (
                <View key={act.id} style={styles.activityItem}>
                  <View style={styles.dot} />
                  <Text style={styles.actName}>{act.name}</Text>
                </View>
              ))}
              {(!stop.activities || stop.activities.length === 0) && (
                <Text style={styles.emptyAct}>No activities scheduled</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  content: { padding: 20 },
  summaryCard: { backgroundColor: COLORS.card, padding: 20, borderRadius: SIZES.radiusLg, marginBottom: 25, borderWidth: 1, borderColor: COLORS.border },
  tripName: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 },
  tripDesc: { fontSize: 16, color: COLORS.textSecondary, lineHeight: 24, marginBottom: 20 },
  shareActions: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 15 },
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
  actionText: { color: COLORS.primary, fontWeight: 'bold', marginLeft: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 15 },
  stopCard: { backgroundColor: COLORS.surface, padding: 15, borderRadius: SIZES.radius, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: COLORS.accent },
  stopHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  stopCity: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginLeft: 10 },
  activitiesList: { paddingLeft: 30 },
  activityItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.textMuted, marginRight: 10 },
  actName: { color: COLORS.text, fontSize: 15 },
  emptyAct: { color: COLORS.textMuted, fontStyle: 'italic', fontSize: 14 },
  errorText: { color: COLORS.danger, textAlign: 'center', marginTop: 50, fontSize: 16 }
});

export default SharedItineraryScreen;
