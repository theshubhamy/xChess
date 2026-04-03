import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from 'react-native';
import { Colors } from '../theme/colors';

const GameOverScreen = ({ navigation, route }: any) => {
  const { result, eloChange } = route.params || { result: 'Victory', eloChange: '+18' };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <Text style={[styles.title, result === 'Victory' ? {color: Colors.tertiary} : {color: Colors.onSurfaceVariant}]}>
            {result}
          </Text>
          <View style={styles.piecePlaceholder}>
            {/* Visual focal point for Golden King or Silver piece */}
            <View style={[styles.pieceCircle, result === 'Victory' ? {backgroundColor: Colors.tertiary} : {backgroundColor: Colors.surfaceBright}]} />
          </View>
        </View>
        
        <View style={styles.statsCard}>
          <View style={styles.statLine}>
            <Text style={styles.statLabel}>Result</Text>
            <Text style={styles.statValue}>Checkmate in 34 moves</Text>
          </View>
          <View style={styles.statLine}>
            <Text style={styles.statLabel}>Elo Change</Text>
            <Text style={[styles.statValue, {color: Colors.tertiary}]}>{eloChange} ELO</Text>
          </View>
          <View style={styles.statLine}>
            <Text style={styles.statLabel}>Match Duration</Text>
            <Text style={styles.statValue}>12:45</Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.primaryButtonText}>Finish Match</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Matchmaking', { mode: 'Blitz' })}
          >
            <Text style={styles.secondaryButtonText}>Find New Opponent</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  piecePlaceholder: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieceCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.8,
  },
  statsCard: {
    width: '100%',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 24,
    padding: 24,
    gap: 16,
    marginBottom: 48,
  },
  statLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 16,
    color: Colors.onSurface,
    fontWeight: '700',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: Colors.tertiary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onTertiary,
  },
  secondaryButton: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.onSurface,
  },
});

export default GameOverScreen;
