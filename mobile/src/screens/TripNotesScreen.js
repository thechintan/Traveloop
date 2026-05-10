import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { FileText, Plus, Trash2 } from 'lucide-react-native';
import api from '../api/config';
import { COLORS, SIZES } from '../theme/colors';

const TripNotesScreen = ({ route }) => {
  const { tripId } = route.params || {};
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const response = await api.get(`/api/notes/trip/${tripId}`);
      setNotes(response.data);
    } catch (error) {
      console.log('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (tripId) fetchNotes();
    }, [tripId])
  );

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      const response = await api.post('/api/notes', { trip_id: tripId, content: newNote });
      setNotes([response.data, ...notes]);
      setNewNote('');
    } catch (error) {
      console.log('Error adding note', error);
      Alert.alert('Error', 'Could not save note');
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/api/notes/${id}`);
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.log('Error deleting note', error);
    }
  };

  const renderNote = ({ item }) => (
    <View style={styles.noteCard}>
      <View style={styles.noteHeader}>
        <Text style={styles.noteDate}>{new Date(item.created_at).toLocaleString()}</Text>
        <TouchableOpacity onPress={() => deleteNote(item.id)}>
          <Trash2 color={COLORS.danger} size={16} />
        </TouchableOpacity>
      </View>
      <Text style={styles.noteContent}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trip Journal</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a note, confirmation number, etc..."
          placeholderTextColor={COLORS.textMuted}
          value={newNote}
          onChangeText={setNewNote}
          multiline
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
          <Plus color={COLORS.white} size={24} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNote}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <FileText color={COLORS.textMuted} size={40} />
              <Text style={styles.emptyText}>No notes yet. Start journaling!</Text>
            </View>
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
  inputContainer: { flexDirection: 'row', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  input: {
    flex: 1, minHeight: 60, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: SIZES.radius, padding: 15, color: COLORS.text, fontSize: 16, textAlignVertical: 'top'
  },
  addButton: {
    width: 60, backgroundColor: COLORS.primary, borderRadius: SIZES.radius,
    justifyContent: 'center', alignItems: 'center', marginLeft: 10,
  },
  listContainer: { padding: 20 },
  noteCard: {
    backgroundColor: COLORS.card, padding: 15, borderRadius: SIZES.radius,
    marginBottom: 15, borderWidth: 1, borderColor: COLORS.border,
  },
  noteHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  noteDate: { color: COLORS.textSecondary, fontSize: 12 },
  noteContent: { color: COLORS.text, fontSize: 15, lineHeight: 22 },
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: COLORS.textMuted, fontStyle: 'italic', marginTop: 10 },
});

export default TripNotesScreen;
