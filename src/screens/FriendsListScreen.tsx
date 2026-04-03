import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList, TextInput } from 'react-native';
import { Colors } from '../theme/colors';

const FriendsListScreen = ({ navigation }: any) => {
  const friends = [
    { id: '1', name: 'Grandmaster Vance', elo: '2150', status: 'Online' },
    { id: '2', name: 'Hikaru_N', elo: '2850', status: 'Online' },
    { id: '3', name: 'Vishy_A', elo: '2750', status: 'Offline' },
    { id: '4', name: 'Magnus_C', elo: '2860', status: 'Offline' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Search Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Social</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>Back</Text>
        </TouchableOpacity>
        
        <View style={styles.searchBar}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Find Grandmasters..."
            placeholderTextColor={Colors.onSurfaceVariant}
          />
        </View>
      </View>
      
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <Text style={styles.sectionHeader}>YOUR CONNECTIONS</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <View style={styles.friendInfo}>
              <View style={[styles.avatarSmall, item.status === 'Online' && styles.onlineIndicator]} />
              <View>
                <Text style={styles.friendName}>{item.name}</Text>
                <Text style={styles.friendElo}>{item.elo} ELO · {item.status}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.inviteButton}
              onPress={() => navigation.navigate('Matchmaking', { mode: 'Friend' })}
            >
              <Text style={styles.inviteButtonText}>INVITE</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Pending Requests Placeholder */}
      <View style={styles.pendingSection}>
        <Text style={styles.sectionHeader}>PENDING REQUESTS</Text>
        <View style={styles.pendingCard}>
          <Text style={styles.pendingText}>No pending friend requests.</Text>
        </View>
      </View>
    </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.onSurface,
    marginBottom: 8,
  },
  backLink: {
    color: Colors.tertiary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    color: Colors.onSurface,
    fontSize: 16,
  },
  listContent: {
    padding: 24,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    marginBottom: 16,
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceBright,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  onlineIndicator: {
    borderColor: 'lightgreen',
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  friendElo: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  inviteButton: {
    backgroundColor: Colors.tertiary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  inviteButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.onTertiary,
  },
  pendingSection: {
    padding: 24,
    paddingBottom: 48,
  },
  pendingCard: {
    backgroundColor: Colors.surfaceContainerLow,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingText: {
    color: Colors.onSurfaceVariant,
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default FriendsListScreen;
