import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { DollarSign, Home, Car, Activity } from 'lucide-react-native';
import api from '../api/config';
import { COLORS, SIZES } from '../theme/colors';

const screenWidth = Dimensions.get('window').width;

const BudgetScreen = ({ route }) => {
  const { tripId } = route.params || {};
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBudget = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/budget/trip/${tripId}`);
      setBudgetData(response.data);
    } catch (error) {
      console.log('Error fetching budget:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (tripId) fetchBudget();
    }, [tripId])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  if (!budgetData) return null;

  const totalTracked = (budgetData.transport_total || 0) + (budgetData.accommodation_total || 0) + (budgetData.activities_total || 0);

  const getPercentage = (amount) => {
    if (totalTracked === 0) return 0;
    return (amount / totalTracked) * 100;
  };

  const StatBox = ({ title, amount, icon: Icon, color }) => (
    <View style={styles.statBox}>
      <View style={[styles.iconWrapper, { backgroundColor: color + '20' }]}>
        <Icon color={color} size={20} />
      </View>
      <View>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statAmount}>${amount.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Budget Breakdown</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Estimated Total Cost</Text>
          <Text style={styles.totalAmount}>${budgetData.grand_total.toFixed(2)}</Text>
        </View>

        {totalTracked > 0 ? (
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>Expense Distribution</Text>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabelText}>Transport ({getPercentage(budgetData.transport_total).toFixed(0)}%)</Text>
                <Text style={styles.progressAmountText}>${(budgetData.transport_total || 0).toFixed(0)}</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${getPercentage(budgetData.transport_total)}%`, backgroundColor: COLORS.primary }]} />
              </View>

              <View style={styles.progressLabels}>
                <Text style={styles.progressLabelText}>Accommodation ({getPercentage(budgetData.accommodation_total).toFixed(0)}%)</Text>
                <Text style={styles.progressAmountText}>${(budgetData.accommodation_total || 0).toFixed(0)}</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${getPercentage(budgetData.accommodation_total)}%`, backgroundColor: COLORS.accent }]} />
              </View>

              <View style={styles.progressLabels}>
                <Text style={styles.progressLabelText}>Activities ({getPercentage(budgetData.activities_total).toFixed(0)}%)</Text>
                <Text style={styles.progressAmountText}>${(budgetData.activities_total || 0).toFixed(0)}</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${getPercentage(budgetData.activities_total)}%`, backgroundColor: COLORS.warning }]} />
              </View>
            </View>

          </View>
        ) : (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyText}>Add stops and activities to see budget charts.</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Category Details</Text>
        <View style={styles.statsGrid}>
          <StatBox title="Transport" amount={budgetData.transport_total} icon={Car} color={COLORS.primary} />
          <StatBox title="Accommodation" amount={budgetData.accommodation_total} icon={Home} color={COLORS.accent} />
          <StatBox title="Activities" amount={budgetData.activities_total} icon={Activity} color={COLORS.warning} />
          <StatBox title="Misc / Avg" amount={0} icon={DollarSign} color={COLORS.danger} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  scrollContainer: { padding: 20 },
  totalCard: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: SIZES.radiusLg,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
  },
  totalLabel: { color: COLORS.white, opacity: 0.8, fontSize: 14, marginBottom: 5 },
  totalAmount: { color: COLORS.white, fontSize: 36, fontWeight: 'bold' },
  chartContainer: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    padding: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 15 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statBox: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  statTitle: { color: COLORS.textSecondary, fontSize: 12 },
  statAmount: { color: COLORS.text, fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  emptyChart: { padding: 30, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: COLORS.textMuted, fontStyle: 'italic' },
  progressBarContainer: { marginTop: 10 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, marginTop: 15 },
  progressLabelText: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
  progressAmountText: { color: COLORS.textSecondary, fontSize: 14 },
  track: { width: '100%', height: 12, backgroundColor: COLORS.background, borderRadius: 6, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 6 },
});

export default BudgetScreen;
