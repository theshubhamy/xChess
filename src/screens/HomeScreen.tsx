import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image, FlatList } from 'react-native';
import { Colors } from '../theme/colors';

const HomeScreen = ({ navigation }: any) => {
  const recentGames = [
    { id: '1', opponent: 'Grandmaster Vance', result: 'Loss', eloChange: '-12', mode: 'Classical' },
    { id: '2', opponent: 'Hikaru_N', result: 'Win', eloChange: '+18', mode: 'Blitz' },
    { id: '3', opponent: 'Vishy_A', result: 'Draw', eloChange: '0', mode: 'Rapid' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.profileSummary}
          onPress={() => navigation.navigate('UserProfile')}
        >
          <View style={styles.avatarPlaceholder} />
          <View style={styles.profileText}>
            <Text style={styles.userName}>Grandmaster Vance</Text>
            <Text style={styles.userElo}>2150 (ELO) · Rank #1,242</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Game Modes */}
        <Text style={styles.listHeader}>GAME MODES</Text>
        <View style={styles.gameModesGrid}>
          <TouchableOpacity 
            style={[styles.gameModeCard, styles.mainCard]}
            onPress={() => navigation.navigate('Matchmaking', { mode: 'Blitz' })}
          >
            <Text style={styles.cardTitle}>Quick Match</Text>
            <Text style={styles.cardSub}>Random user matchmaking for instant play.</Text>
          </TouchableOpacity>
          
          <View style={styles.secondaryModes}>
            <TouchableOpacity 
              style={styles.gameModeCardSecondary}
              onPress={() => navigation.navigate('Matchmaking', { mode: 'AI' })}
            >
              <Text style={styles.cardTitleSecondary}>Play with AI</Text>
              <Text style={styles.cardSubSecondary}>Select difficulty and practice offline.</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.gameModeCardSecondary}
              onPress={() => navigation.navigate('FriendsList')}
            >
              <Text style={styles.cardTitleSecondary}>Play with Friend</Text>
              <Text style={styles.cardSubSecondary}>Invite or search friends to challenge.</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Recent Games */}
        <Text style={styles.listHeader}>RECENT GAMES</Text>
        <FlatList
          data={recentGames}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.gameItem}>
              <View style={styles.gameItemLeft}>
                <Text style={styles.opponentName}>vs. {item.opponent}</Text>
                <Text style={styles.gameMode}>{item.mode}</Text>
              </View>
              <View style={styles.gameItemRight}>
                <Text style={[styles.gameResult, item.result === 'Loss' && {color: 'lightcoral'}, item.result === 'Win' && {color: 'lightgreen'}]}>{item.result}</Text>
                <Text style={styles.eloChange}>{item.eloChange} ELO</Text>
              </View>
            </View>
          )}
        />
      </ScrollView>

      {/* Content ends here, Bottom Bar is handled by MainTabNavigator */}
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
  profileSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.surfaceBright,
    marginRight: 16,
  },
  profileText: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  userElo: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  scrollContent: {
    padding: 24,
  },
  listHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    marginBottom: 16,
  },
  gameModesGrid: {
    marginBottom: 40,
  },
  gameModeCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  mainCard: {
    backgroundColor: Colors.tertiary,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.onTertiary,
  },
  cardSub: {
    fontSize: 14,
    color: Colors.onTertiary,
    opacity: 0.8,
    marginTop: 4,
  },
  secondaryModes: {
    flexDirection: 'row',
    gap: 16,
  },
  gameModeCardSecondary: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 16,
    padding: 16,
  },
  cardTitleSecondary: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  cardSubSecondary: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
  gameItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  gameItemLeft: {
    flex: 1,
  },
  opponentName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  gameMode: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  gameItemRight: {
    alignItems: 'flex-end',
  },
  gameResult: {
    fontSize: 16,
    fontWeight: '700',
  },
  eloChange: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: Colors.surfaceContainer,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
  },
  navText: {
    color: Colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '600',
  },
  navTextActive: {
    color: Colors.tertiary,
    fontSize: 12,
    fontWeight: '700',
  },
});

export default HomeScreen;
