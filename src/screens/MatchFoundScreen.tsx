import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated } from 'react-native';
import { Colors } from '../theme/colors';

const MatchFoundScreen = ({ navigation, route }: any) => {
  const { opponent, mode } = route.params || { opponent: 'Magnus_C', mode: 'Blitz' };
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
    }).start();

    // Countdown and navigation
    const timer = setTimeout(() => {
      navigation.navigate('ChessBoard', { gameId: 'sample-game-123' });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.matchTitle}>MATCH FOUND</Text>
        
        <View style={styles.matchDetail}>
          <View style={styles.playerInfo}>
            <View style={styles.avatarSmall} />
            <Text style={styles.playerName}>You</Text>
            <Text style={styles.playerElo}>2150 Elo</Text>
          </View>
          
          <Text style={styles.vsText}>VS</Text>
          
          <View style={styles.playerInfo}>
            <View style={[styles.avatarSmall, {borderColor: Colors.tertiary, borderWidth: 2}]} />
            <Text style={styles.playerName}>{opponent}</Text>
            <Text style={styles.playerElo}>2860 Elo</Text>
          </View>
        </View>
        
        <View style={styles.countdownContainer}>
          <Text style={styles.statusText}>Game starting in...</Text>
          <Text style={styles.countdownText}>3</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(11, 19, 38, 0.9)', // Semi-transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  matchTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.tertiary,
    letterSpacing: 4,
    marginBottom: 40,
  },
  matchDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 48,
  },
  playerInfo: {
    alignItems: 'center',
    flex: 1,
  },
  avatarSmall: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surfaceBright,
    marginBottom: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  playerElo: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  vsText: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.surfaceContainerHighest,
  },
  countdownContainer: {
    alignItems: 'center',
  },
  statusText: {
    color: Colors.onSurfaceVariant,
    fontSize: 14,
    marginBottom: 8,
  },
  countdownText: {
    color: Colors.tertiary,
    fontSize: 48,
    fontWeight: '800',
  },
});

export default MatchFoundScreen;
