import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import { Colors } from '../theme/colors';

const LeaderboardScreen = ({ navigation }: any) => {
  const rankings = [
    { id: '1', rank: '#1', name: 'Magnus_C', elo: '2860', status: 'Online' },
    { id: '2', rank: '#2', name: 'Hikaru_N', elo: '2855', status: 'Online' },
    { id: '3', rank: '#3', name: 'Caruana_F', elo: '2835', status: 'Offline' },
    { id: '4', rank: '#4', name: 'Grandmaster Vance', elo: '2150', status: 'Your Rank', isUser: true },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>World Rankings</Text>
      </View>
      
      <FlatList
        data={rankings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.rankItem, item.isUser && styles.userRankItem]}>
            <Text style={styles.rankNumber}>{item.rank}</Text>
            <View style={styles.avatarSmall} />
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{item.name}</Text>
              <Text style={styles.playerStatus}>{item.status}</Text>
            </View>
            <Text style={styles.eloValue}>{item.elo}</Text>
          </View>
        )}
      />
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
  listContent: {
    padding: 24,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  userRankItem: {
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  rankNumber: {
    width: 40,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.tertiary,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceBright,
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  playerStatus: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  eloValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.onSurface,
  },
});

export default LeaderboardScreen;
