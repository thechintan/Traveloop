import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, User, Lock, Settings } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../api/config';
import { COLORS, SIZES } from '../theme/colors';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [editing, setEditing] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      await api.put('/api/auth/profile', { name });
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.profileSection}>
        <Image 
          source={{ uri: user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name?.replace(' ', '+')}&background=E31B23&color=fff` }} 
          style={styles.avatar} 
        />
        <Text style={styles.emailText}>{user?.email}</Text>
        <Text style={styles.roleBadge}>{user?.role ? user.role.toUpperCase() : 'USER'}</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Account Details</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <User color={COLORS.textMuted} size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              editable={editing}
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
        </View>

        {editing ? (
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actionSection}>
        {user?.role === 'admin' && (
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AdminDashboard')}>
            <Settings color={COLORS.text} size={20} />
            <Text style={styles.actionText}>Admin Dashboard</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut color={COLORS.danger} size={20} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  profileSection: { alignItems: 'center', padding: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  emailText: { color: COLORS.textSecondary, fontSize: 16, marginBottom: 5 },
  roleBadge: { backgroundColor: COLORS.surface, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, color: COLORS.accent, fontSize: 12, fontWeight: 'bold' },
  formSection: { padding: 20 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  inputGroup: { marginBottom: 15 },
  label: { color: COLORS.textSecondary, fontSize: 14, marginBottom: 5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, paddingHorizontal: 15 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, color: COLORS.text, fontSize: 16 },
  editButton: { backgroundColor: COLORS.surface, padding: 15, borderRadius: SIZES.radius, alignItems: 'center', marginTop: 10 },
  editButtonText: { color: COLORS.text, fontWeight: 'bold', fontSize: 16 },
  saveButton: { backgroundColor: COLORS.primary, padding: 15, borderRadius: SIZES.radius, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  actionSection: { padding: 20, marginTop: 'auto' },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, padding: 15, borderRadius: SIZES.radius, marginBottom: 15 },
  actionText: { color: COLORS.text, fontSize: 16, fontWeight: 'bold', marginLeft: 15 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, padding: 15, borderRadius: SIZES.radius },
  logoutText: { color: COLORS.danger, fontSize: 16, fontWeight: 'bold', marginLeft: 15 }
});

export default ProfileScreen;
