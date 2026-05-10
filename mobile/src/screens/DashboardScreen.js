import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, MapPin } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SIZES } from '../theme/colors';

const DashboardScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
          </View>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Where are we going next?</Text>
          <Text style={styles.heroSubtitle}>The world is yours to explore.</Text>
          <TouchableOpacity 
            style={styles.heroButton}
            onPress={() => navigation.navigate('CreateTrip')}
          >
            <Plus color={COLORS.white} size={20} />
            <Text style={styles.heroButtonText}>Plan New Trip</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions Placeholder */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Trips</Text>
          <TouchableOpacity onPress={() => navigation.navigate('My Trips')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emptyState}>
          <MapPin color={COLORS.textMuted} size={40} />
          <Text style={styles.emptyStateText}>No trips planned yet</Text>
          <Text style={styles.emptyStateSubtext}>Tap 'Plan New Trip' to get started</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    padding: 25,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primaryLight,
    marginBottom: 5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  heroButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: SIZES.radius,
  },
  heroButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  emptyState: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  emptyStateSubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 5,
  }
});

export default DashboardScreen;
