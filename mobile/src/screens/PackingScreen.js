import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { CheckSquare, Square, Plus, Trash2 } from 'lucide-react-native';
import api from '../api/config';
import { COLORS, SIZES } from '../theme/colors';

const PackingScreen = ({ route }) => {
  const { tripId } = route.params || {};
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const response = await api.get(`/api/packing/trip/${tripId}`);
      setItems(response.data);
    } catch (error) {
      console.log('Error fetching packing items:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (tripId) fetchItems();
    }, [tripId])
  );

  const handleAddItem = async () => {
    if (!newItemName.trim()) return;
    try {
      const response = await api.post('/api/packing', { trip_id: tripId, item_name: newItemName, category: 'general' });
      setItems([...items, response.data]);
      setNewItemName('');
    } catch (error) {
      console.log('Error adding item', error);
    }
  };

  const toggleItem = async (id, isPacked) => {
    try {
      await api.put(`/api/packing/${id}/toggle`);
      setItems(items.map(item => item.id === id ? { ...item, is_packed: !isPacked } : item));
    } catch (error) {
      console.log('Error toggling item', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await api.delete(`/api/packing/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.log('Error deleting item', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <TouchableOpacity style={styles.checkboxContainer} onPress={() => toggleItem(item.id, item.is_packed)}>
        {item.is_packed ? <CheckSquare color={COLORS.primary} size={24} /> : <Square color={COLORS.textMuted} size={24} />}
        <Text style={[styles.itemName, item.is_packed && styles.itemPacked]}>{item.item_name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteItem(item.id)}>
        <Trash2 color={COLORS.danger} size={20} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Packing List</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add an item..."
          placeholderTextColor={COLORS.textMuted}
          value={newItemName}
          onChangeText={setNewItemName}
          onSubmitEditing={handleAddItem}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Plus color={COLORS.white} size={20} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Your packing list is empty. Add some items above!</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  inputContainer: { flexDirection: 'row', padding: 20, paddingBottom: 10 },
  input: {
    flex: 1, height: 50, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: SIZES.radius, paddingHorizontal: 15, color: COLORS.text, fontSize: 16,
  },
  addButton: {
    width: 50, height: 50, backgroundColor: COLORS.primary, borderRadius: SIZES.radius,
    justifyContent: 'center', alignItems: 'center', marginLeft: 10,
  },
  listContainer: { padding: 20 },
  itemRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.card, padding: 15, borderRadius: SIZES.radius,
    marginBottom: 10, borderWidth: 1, borderColor: COLORS.border,
  },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  itemName: { color: COLORS.text, fontSize: 16, marginLeft: 12 },
  itemPacked: { color: COLORS.textMuted, textDecorationLine: 'line-through' },
  emptyText: { color: COLORS.textMuted, textAlign: 'center', marginTop: 30, fontStyle: 'italic' },
});

export default PackingScreen;
