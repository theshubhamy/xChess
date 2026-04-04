import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Share2, TrendingUp, Clock, Star, Zap, RefreshCw, Home, Search } from 'lucide-react-native';
import { Colors } from '../theme/colors';

const GameOverScreen = ({ navigation, route }: any) => {
  const { result } = route.params || { result: 'Victory' };
  const isVictory = result !== 'Defeat' && result !== 'Resigned';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('MainApp')}>
          <X size={20} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>MATCH RESULTS</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Share2 size={20} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Victory / Defeat Headline */}
          <View style={styles.heroSection}>
            {/* Ambient glow behind trophy */}
            <View style={[styles.glowOrb, !isVictory && styles.glowOrbSilver]} />

            {/* Trophy / King piece */}
            <View style={styles.heroIconWrap}>
              <Text style={[styles.heroEmoji, !isVictory && styles.heroEmojiMuted]}>
                {isVictory ? '♛' : '♙'}
              </Text>
            </View>

            <Text style={[styles.resultTitle, !isVictory && styles.defeatTitle]}>
              {isVictory ? 'VICTORY' : 'DEFEAT'}
            </Text>
            <View style={[styles.glassBar, !isVictory && styles.silveryBar]} />
            <Text style={styles.resultSub}>
              Match concluded by {result.toLowerCase()}
            </Text>
          </View>

          {/* Stats Bento Card — glassmorphism */}
          <View style={styles.statsCard}>
            {/* Final Result */}
            <View style={styles.statsTopRow}>
              <Text style={styles.statsTopLabel}>FINAL RESULT</Text>
              <Text style={styles.statsTopValue}>Checkmate in 34 moves</Text>
            </View>

            {/* ELO + Duration Row */}
            <View style={styles.statsGrid}>
              <View style={styles.statBlock}>
                <Text style={styles.statBlockLabel}>ELO CHANGE</Text>
                <View style={styles.statValueRow}>
                  {isVictory
                    ? <TrendingUp size={16} color={Colors.tertiary} />
                    : <TrendingUp size={16} color={Colors.error} style={{ transform: [{ rotate: '180deg' }] }} />
                  }
                  <Text style={[styles.eloValue, isVictory ? styles.eloGain : styles.eloLoss]}>
                    {isVictory ? '+18 ELO' : '-14 ELO'}
                  </Text>
                </View>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBlock}>
                <Text style={styles.statBlockLabel}>DURATION</Text>
                <View style={styles.statValueRow}>
                  <Clock size={16} color={Colors.primary} />
                  <Text style={styles.durationValue}>12:45</Text>
                </View>
              </View>
            </View>

            {/* Accolades */}
            <View style={styles.accoladeRow}>
              <View style={styles.accoladeBadge}>
                <Star size={12} color={Colors.primary} />
                <Text style={styles.accoladeText}>MASTER ACCURACY</Text>
              </View>
              <View style={styles.accoladeGoldBadge}>
                <Zap size={12} color={Colors.tertiary} />
                <Text style={styles.accoladeGoldText}>RAPID PLAY</Text>
              </View>
            </View>
          </View>

          {/* Match Details */}
          <View style={styles.detailSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Opponent</Text>
              <Text style={styles.detailValue}>Magnus_C (2860)</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Accuracy</Text>
              <Text style={styles.detailValue}>84.2%</Text>
            </View>
          </View>

          <Text style={styles.matchId}>MATCH ID: #XC-9283-B</Text>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.actionConsole}>
          <TouchableOpacity style={styles.iconActionBtn} onPress={() => navigation.navigate('Matchmaking')}>
            <RefreshCw size={22} color={Colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.analysisBtn}>
            <Search size={18} color={Colors.onSurfaceVariant} />
            <Text style={styles.analysisBtnText}>Analysis</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.newMatchBtn}
            onPress={() => navigation.navigate('Matchmaking')}
          >
            <Text style={styles.newMatchBtnText}>NEW MATCH</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  safeArea: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: 'rgba(11, 19, 38, 0.8)',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  /* Hero */
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
    position: 'relative',
  },
  glowOrb: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(234, 195, 74, 0.06)',
    top: 0,
  },
  glowOrbSilver: {
    backgroundColor: 'rgba(188, 199, 222, 0.05)',
  },
  heroIconWrap: {
    width: 160,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroEmoji: {
    fontSize: 110,
    color: Colors.tertiary,
    opacity: 0.85,
  },
  heroEmojiMuted: {
    color: Colors.onSurfaceVariant,
    opacity: 0.5,
  },
  resultTitle: {
    fontSize: 60,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: -2,
  },
  defeatTitle: {
    color: Colors.onSurface,
    opacity: 0.8,
  },
  glassBar: {
    width: 80,
    height: 4,
    backgroundColor: Colors.tertiary,
    borderRadius: 2,
    marginVertical: 20,
    opacity: 0.5,
  },
  silveryBar: {
    backgroundColor: Colors.surfaceContainerHighest,
  },
  resultSub: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  /* Stats glassmorphism card */
  statsCard: {
    backgroundColor: 'rgba(49, 57, 77, 0.4)',
    borderRadius: 28,
    padding: 24,
    marginBottom: 16,
    // RN doesn't natively support backdrop-blur — use rgba for glass effect
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    gap: 16,
    overflow: 'hidden',
  },
  statsTopRow: {
    alignItems: 'center',
    gap: 6,
  },
  statsTopLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  statsTopValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.onSurface,
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  statBlockLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eloValue: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  eloGain: { color: Colors.tertiary },
  eloLoss: { color: Colors.error },
  durationValue: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.5,
  },
  statDivider: {
    width: 1.5,
    height: 40,
    backgroundColor: 'rgba(69, 71, 76, 0.2)',
    marginHorizontal: 20,
  },
  accoladeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  accoladeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  accoladeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  accoladeGoldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(204, 168, 48, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  accoladeGoldText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.tertiary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  /* Match detail rows */
  detailSection: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: Colors.onSurface,
    fontWeight: '900',
  },
  matchId: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    textTransform: 'uppercase',
    opacity: 0.5,
    marginTop: 16,
  },
  /* Bottom action console */
  actionConsole: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  iconActionBtn: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(45, 52, 73, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(69, 71, 76, 0.2)',
  },
  analysisBtn: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.secondaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  analysisBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  newMatchBtn: {
    flex: 1.5,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(234, 195, 74, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newMatchBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

export default GameOverScreen;
