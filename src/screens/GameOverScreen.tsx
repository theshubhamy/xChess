import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, Dimensions } from 'react-native';
import { Trophy, TrendingUp, Search, Home, RefreshCw } from 'lucide-react-native';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const GameOverScreen = ({ navigation, route }: any) => {
  const { result } = route.params || { result: 'Victory' };
  const isVictory = result !== 'Defeat' && result !== 'Resigned';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={[styles.glassTrophyContainer, !isVictory && styles.defeatedTrophy]}>
                <Trophy size={60} color={isVictory ? Colors.tertiary : Colors.onSurfaceVariant} fill={isVictory ? Colors.tertiary : 'transparent'} />
              </View>
              <Text style={[styles.resultTitle, !isVictory && styles.defeatTitle]}>
                {isVictory ? 'VICTORY' : 'DEFEAT'}
              </Text>
              <View style={[styles.glassBar, !isVictory && styles.silverBar]} />
              <Text style={styles.resultSub}>Match concluded by {result.toLowerCase()}</Text>
            </View>

            <View style={styles.glassSummaryCard}>
              <Text style={styles.cardTitle}>PERFORMANCE REVIEW</Text>
              
              <View style={styles.statRow}>
                <View style={styles.mainStat}>
                  <Text style={styles.statLabel}>ELO CHANGE</Text>
                  <View style={styles.statValueRow}>
                    <Text style={[styles.eloChange, isVictory ? styles.eloPlus : styles.eloMinus]}>
                      {isVictory ? '+18' : '-14'}
                    </Text>
                    <TrendingUp size={16} color={isVictory ? '#4ade80' : '#f87171'} />
                  </View>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.mainStat}>
                  <Text style={styles.statLabel}>ACCURACY</Text>
                  <Text style={styles.statValue}>84.2%</Text>
                </View>
              </View>

              <View style={styles.detailList}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Opponent</Text>
                  <Text style={styles.detailValue}>Magnus_C (2860)</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>12m 45s</Text>
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                activeOpacity={0.8}
                style={styles.primaryGlassButton}
              >
                <Search size={20} color={Colors.tertiary} />
                <Text style={styles.primaryButtonText}>ANALYZE DUEL</Text>
              </TouchableOpacity>

              <View style={styles.secondaryRow}>
                <TouchableOpacity 
                  style={styles.secondaryGlassButton}
                  onPress={() => navigation.navigate('Matchmaking')}
                >
                  <RefreshCw size={18} color={Colors.onSurface} />
                  <Text style={styles.secondaryButtonText}>REMATCH</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.secondaryGlassButton}
                  onPress={() => navigation.navigate('Home')}
                >
                  <Home size={18} color={Colors.onSurface} />
                  <Text style={styles.secondaryButtonText}>DASHBOARD</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  glassTrophyContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(234, 195, 74, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(234, 195, 74, 0.2)',
  },
  defeatedTrophy: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 8,
  },
  defeatTitle: {
    color: Colors.onSurface,
  },
  glassBar: {
    width: 60,
    height: 4,
    backgroundColor: Colors.tertiary,
    marginVertical: 20,
    borderRadius: 2,
    opacity: 0.5,
  },
  silverBar: {
    backgroundColor: Colors.surfaceContainerHighest,
  },
  resultSub: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  glassSummaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  mainStat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    marginBottom: 6,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eloChange: {
    fontSize: 28,
    fontWeight: '900',
  },
  eloPlus: {
    color: '#4ade80',
  },
  eloMinus: {
    color: '#f87171',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.onSurface,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
  },
  detailList: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    color: Colors.onSurface,
    fontWeight: '800',
  },
  buttonContainer: {
    gap: 16,
  },
  primaryGlassButton: {
    flexDirection: 'row',
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(234, 195, 74, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.3)',
    gap: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 2,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryGlassButton: {
    flex: 1,
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 10,
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.onSurface,
    letterSpacing: 1,
  },
});

export default GameOverScreen;
