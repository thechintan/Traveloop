import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, DollarSign, Star, Compass } from 'lucide-react-native';
import api from '../api/config';
import { COLORS, SIZES } from '../theme/colors';

const ExploreScreen = ({ route, navigation }) => {
  const { selectMode, returnTo, type, tripId, stopId } = route?.params || {};
  const [activeTab, setActiveTab] = useState(type || 'cities'); // 'cities' or 'activities'
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = activeTab === 'cities' ? '/api/cities' : '/api/activities';
      // Basic filtering client-side for hackathon speed, or use query params if backend supports
      const response = await api.get(endpoint);
      setData(response.data);
    } catch (error) {
      console.log('Error fetching explore data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.country && item.country.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectCity = async (city) => {
    if (!selectMode || type !== 'city') return;
    try {
      await api.post('/api/stops', { trip_id: tripId, city_id: city.id });
      navigation.goBack();
    } catch (err) {
      console.log('Error adding city', err);
    }
  };

  const handleSelectActivity = async (activity) => {
    if (!selectMode || type !== 'activity') return;
    try {
      await api.post(`/api/stops/${stopId}/activities`, { activity_id: activity.id });
      navigation.goBack();
    } catch (err) {
      console.log('Error adding activity', err);
    }
  };

  const renderCity = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleSelectCity(item)} disabled={!selectMode || type !== 'city'}>
      <Image 
        source={{ uri: item.image_url || `https://picsum.photos/seed/${item.name}/400/300` }} 
        style={styles.cardImage} 
      />
      <View style={styles.cardContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemSub}>{item.country}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaBadge}>
            <DollarSign size={14} color={COLORS.accent} />
            <Text style={styles.metaText}>Cost Index: {item.cost_index}/5</Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        {selectMode && type === 'city' && (
          <View style={styles.selectBtn}>
            <Text style={styles.selectBtnText}>Add to Trip</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderActivity = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleSelectActivity(item)} disabled={!selectMode || type !== 'activity'}>
      <Image 
        source={{ uri: item.image_url || `https://picsum.photos/seed/${item.id}activity/400/300` }} 
        style={styles.cardImage} 
      />
      <View style={styles.cardContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.metaRow}>
          <View style={[styles.metaBadge, { backgroundColor: COLORS.surface }]}>
            <Text style={styles.metaText}>{item.category.toUpperCase()}</Text>
          </View>
          <View style={styles.metaBadge}>
            <Star size={14} color={COLORS.warning} />
            <Text style={styles.metaText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <View style={styles.costRow}>
          <Text style={styles.costText}>Est. Cost: ${item.estimated_cost}</Text>
          <Text style={styles.durationText}>{item.duration_hours} hrs</Text>
        </View>
        {selectMode && type === 'activity' && (
          <View style={styles.selectBtn}>
            <Text style={styles.selectBtnText}>Add to Stop</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search color={COLORS.textMuted} size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${activeTab}...`}
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'cities' && styles.activeTab]}
          onPress={() => setActiveTab('cities')}
        >
          <Text style={[styles.tabText, activeTab === 'cities' && styles.activeTabText]}>Cities</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'activities' && styles.activeTab]}
          onPress={() => setActiveTab('activities')}
        >
          <Text style={[styles.tabText, activeTab === 'activities' && styles.activeTabText]}>Activities</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={activeTab === 'cities' ? renderCity : renderActivity}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: COLORS.text,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: SIZES.radius - 2,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: COLORS.white,
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLg,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  itemSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: SIZES.radius,
    marginRight: 10,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  description: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    marginTop: 5,
  },
  costText: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  durationText: {
    color: COLORS.textSecondary,
  },
  selectBtn: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: 10,
  },
  selectBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
  }
});

export default ExploreScreen;
