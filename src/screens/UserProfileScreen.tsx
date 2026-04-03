import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';

const UserProfileScreen = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <View style={styles.profileHero}>
        <View style={styles.avatarLarge} />
        <Text style={styles.userName}>Grandmaster Vance</Text>
        <Text style={styles.userElo}>2150 ELO · Rank #1,242</Text>
      </View>
      
      <View style={styles.statsSection}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Wins</Text>
          <Text style={styles.statValue}>1,432</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Losses</Text>
          <Text style={styles.statValue}>843</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Draws</Text>
          <Text style={styles.statValue}>211</Text>
        </View>
      </View>
      
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>SETTINGS</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Account Management</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Security & Privacy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Game Preferences</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: Colors.surfaceContainer,
  },
  backLink: {
    color: Colors.tertiary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  profileHero: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.surfaceContainerLow,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surfaceBright,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: Colors.tertiary,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  userElo: {
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 24,
    backgroundColor: Colors.surfaceContainer,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  settingsSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    marginBottom: 16,
  },
  settingItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  signOutButton: {
    marginTop: 48,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerHighest,
    marginBottom: 40,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
  },
});

export default UserProfileScreen;
