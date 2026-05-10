import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Map, Navigation, ShieldAlert, BarChart3 } from 'lucide-react-native';
import api from '../api/config';
import { COLORS, SIZES } from '../theme/colors';

const screenWidth = Dimensions.get('window').width;

const AdminDashboardScreen = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      setStats(response.data);
    } catch (err) {
      console.log('Error fetching admin stats', err);
      setError('Failed to load admin analytics. Are you logged in as an admin?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  if (error || !stats) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <ShieldAlert color={COLORS.danger} size={48} />
          <Text style={styles.errorText}>{error || 'Access Denied'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Format data for charts
  const maxTripCount = stats.topCities.length > 0 
    ? Math.max(...stats.topCities.map(c => c.trip_count || 0)) 
    : 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics Dashboard</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        
        <View style={styles.grid}>
          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: COLORS.primary + '20' }]}>
              <Users color={COLORS.primary} size={24} />
            </View>
            <Text style={styles.statValue}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: COLORS.accent + '20' }]}>
              <Navigation color={COLORS.accent} size={24} />
            </View>
            <Text style={styles.statValue}>{stats.totalTrips}</Text>
            <Text style={styles.statLabel}>Trips Created</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: COLORS.warning + '20' }]}>
              <Map color={COLORS.warning} size={24} />
            </View>
            <Text style={styles.statValue}>{stats.totalStops}</Text>
            <Text style={styles.statLabel}>Destinations Planned</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: '#4ade80' + '20' }]}>
              <BarChart3 color="#4ade80" size={24} />
            </View>
            <Text style={styles.statValue}>{stats.publicTrips}</Text>
            <Text style={styles.statLabel}>Public Trips</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Top Destinations</Text>
        {stats.topCities.length > 0 ? (
          <View style={styles.chartWrapper}>
            {stats.topCities.slice(0, 5).map((city, index) => {
              const widthPercentage = Math.max((city.trip_count / maxTripCount) * 100, 5);
              return (
                <View key={index} style={styles.customBarRow}>
                  <Text style={styles.customBarLabel} numberOfLines={1}>{city.name}</Text>
                  <View style={styles.customBarTrack}>
                    <View style={[styles.customBarFill, { width: `${widthPercentage}%` }]} />
                  </View>
                  <Text style={styles.customBarValue}>{city.trip_count}</Text>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.emptyText}>Not enough data for chart</Text>
        )}

        <Text style={styles.sectionTitle}>Most Popular Activities</Text>
        <View style={styles.listCard}>
          {stats.topActivities.slice(0, 5).map((act, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listName}>{index + 1}. {act.name}</Text>
              <Text style={styles.listValue}>{act.usage_count} adding</Text>
            </View>
          ))}
          {stats.topActivities.length === 0 && <Text style={styles.emptyText}>No activities saved yet</Text>}
        </View>

        <Text style={styles.sectionTitle}>Recent Trips Created</Text>
        <View style={styles.listCard}>
          {stats.recentTrips.map((trip, index) => (
            <View key={index} style={styles.listItem}>
              <View>
                <Text style={styles.listName}>{trip.name}</Text>
                <Text style={styles.listSubText}>by {trip.user_name}</Text>
              </View>
              <Text style={styles.listValue}>{new Date(trip.created_at).toLocaleDateString()}</Text>
            </View>
          ))}
          {stats.recentTrips.length === 0 && <Text style={styles.emptyText}>No trips created yet</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  content: { padding: 20 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: COLORS.card, padding: 15, borderRadius: SIZES.radiusLg, marginBottom: 15, borderWidth: 1, borderColor: COLORS.border },
  iconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statValue: { color: COLORS.text, fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: COLORS.textSecondary, fontSize: 13, marginTop: 5 },
  chartWrapper: { backgroundColor: COLORS.card, borderRadius: SIZES.radiusLg, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  customBarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  customBarLabel: { width: 80, color: COLORS.text, fontSize: 13, fontWeight: 'bold' },
  customBarTrack: { flex: 1, height: 12, backgroundColor: COLORS.surface, borderRadius: 6, marginHorizontal: 10, overflow: 'hidden' },
  customBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 6 },
  customBarValue: { width: 30, color: COLORS.primary, fontWeight: 'bold', textAlign: 'right' },
  listCard: { backgroundColor: COLORS.card, borderRadius: SIZES.radiusLg, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  listName: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  listSubText: { color: COLORS.textSecondary, fontSize: 13 },
  listValue: { color: COLORS.primary, fontWeight: 'bold' },
  emptyText: { color: COLORS.textMuted, fontStyle: 'italic', padding: 10 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  errorText: { color: COLORS.danger, fontSize: 18, textAlign: 'center', marginTop: 20, fontWeight: 'bold' }
});

export default AdminDashboardScreen;
