import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Award, ChevronRight } from 'lucide-react-native';
import { Colors } from '../theme/colors';

const leaderboardData = [
  { rank: 1, name: 'Grandmaster Vance', elo: 2150, isMe: true },
  { rank: 2, name: 'Hikaru_N', elo: 2135, isMe: false },
  { rank: 3, name: 'Magnus_C', elo: 2122, isMe: false },
];

const contenders = [
  { rank: 4, name: 'QueenGambit', elo: 2095 },
  { rank: 5, name: 'ChessKing', elo: 2082 },
  { rank: 6, name: 'Sienna_Check', elo: 2077 },
  { rank: 7, name: 'KnightRider', elo: 2065, inspire: true },
];

const LeaderboardScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background ambient orbs */}
      <View style={styles.ambientLeft} />
      <View style={styles.ambientRight} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity style={styles.menuIconBtn}>
            <Trophy size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>LEADERBOARD</Text>
        </View>
        <View style={styles.topBarRight}>
          <Text style={styles.rankLabel}>GRANDMASTER</Text>
          <View style={styles.avatarGold}>
            <View style={styles.avatarPlaceholder} />
          </View>
        </View>
      </View>

      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Hero */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Global Ranking</Text>
            <Text style={styles.heroSub}>THE TOP 1% OF XCHESS ELITE</Text>
          </View>

          {/* Filter Segment */}
          <View style={styles.filterSegment}>
            <TouchableOpacity style={styles.filterActive}>
              <Text style={styles.filterActiveText}>GLOBAL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterInactive}>
              <Text style={styles.filterInactiveText}>FRIENDS</Text>
            </TouchableOpacity>
          </View>

          {/* Podium Section */}
          <View style={styles.podium}>
            {/* Rank 2 */}
            <View style={styles.podiumSlot}>
              <View style={styles.podiumAvatarWrap}>
                <View style={[styles.podiumAvatar, styles.silverBorder]} />
                <View style={styles.rankNumBadgeSilver}>
                  <Text style={styles.rankNumText}>#2</Text>
                </View>
              </View>
              <Text style={styles.podiumName}>Hikaru_N</Text>
              <Text style={styles.podiumEloSecondary}>2135</Text>
            </View>

            {/* Rank 1 — Center elevated */}
            <View style={[styles.podiumSlot, styles.podiumCenter]}>
              <View style={styles.crownsAbove}>
                <Trophy size={36} color={Colors.tertiary} />
              </View>
              <View style={styles.podiumAvatarWrap}>
                <View style={[styles.podiumAvatar, styles.podiumAvatarLarge, styles.goldBorder]} />
                <View style={styles.rankNumBadgeGold}>
                  <Text style={styles.rankNumText}>#1</Text>
                </View>
              </View>
              <Text style={styles.podiumNameCenter}>Grandmaster Vance</Text>
              <Text style={styles.podiumEloGold}>2150</Text>
            </View>

            {/* Rank 3 */}
            <View style={styles.podiumSlot}>
              <View style={styles.podiumAvatarWrap}>
                <View style={[styles.podiumAvatar, styles.bronzeBorder]} />
                <View style={styles.rankNumBadgeBronze}>
                  <Text style={styles.rankNumText}>#3</Text>
                </View>
              </View>
              <Text style={styles.podiumName}>Magnus_C</Text>
              <Text style={styles.podiumEloTertiary}>2122</Text>
            </View>
          </View>

          {/* Ranking List */}
          <View style={styles.listSection}>
            <Text style={styles.listLabel}>TOP CONTENDERS</Text>
            <View style={styles.listCards}>
              {contenders.map((item, i) => (
                <View key={i} style={styles.glassCard}>
                  <View style={styles.cardLeft}>
                    <Text style={styles.rankNumber}>{item.rank}</Text>
                    <View style={styles.contenderAvatar} />
                    <View>
                      <Text style={styles.contenderName}>{item.name}</Text>
                      <Text style={styles.contenderElo}>{item.elo} ELO</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={item.inspire ? styles.inspireBtn : styles.challengeBtn}
                  >
                    <Text style={item.inspire ? styles.inspireBtnText : styles.challengeBtnText}>
                      {item.inspire ? 'INSPIRE' : 'CHALLENGE'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: { flex: 1 },
  /* Background ambient orbs — tonal, no gradients */
  ambientLeft: {
    position: 'absolute',
    top: 60,
    left: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(234, 195, 74, 0.04)',
    zIndex: 0,
  },
  ambientRight: {
    position: 'absolute',
    bottom: 120,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(188, 199, 222, 0.04)',
    zIndex: 0,
  },
  /* Top Bar */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 14,
    paddingTop: 52,
    backgroundColor: 'rgba(11, 19, 38, 0.6)',
    zIndex: 10,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rankLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.tertiary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  avatarGold: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: Colors.tertiary,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  /* Hero Section */
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -2,
  },
  heroSub: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  /* Filter Segment */
  filterSegment: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 18,
    padding: 5,
    marginBottom: 36,
  },
  filterActive: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterActiveText: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.onTertiary,
    letterSpacing: 2,
  },
  filterInactive: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterInactiveText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.outlineVariant,
    letterSpacing: 2,
  },
  /* Podium */
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 40,
  },
  podiumSlot: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  podiumCenter: {
    transform: [{ translateY: -24 }],
  },
  crownsAbove: {
    marginBottom: 6,
  },
  podiumAvatarWrap: {
    position: 'relative',
    marginBottom: 8,
  },
  podiumAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 3,
  },
  podiumAvatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  goldBorder: {
    borderColor: Colors.tertiary,
  },
  silverBorder: {
    borderColor: '#8590a6',
  },
  bronzeBorder: {
    borderColor: 'rgba(160, 100, 60, 0.6)',
  },
  rankNumBadgeGold: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    backgroundColor: 'rgba(234, 195, 74, 0.2)',
    borderWidth: 1.5,
    borderColor: Colors.tertiary,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 999,
  },
  rankNumBadgeSilver: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999,
  },
  rankNumBadgeBronze: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    backgroundColor: 'rgba(160, 100, 60, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999,
  },
  rankNumText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.onSurface,
  },
  podiumName: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.onSurface,
    textAlign: 'center',
  },
  podiumNameCenter: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.onSurface,
    textAlign: 'center',
  },
  podiumEloGold: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: -0.5,
  },
  podiumEloSecondary: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primary,
  },
  podiumEloTertiary: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
  },
  /* Ranking list */
  listSection: {
    gap: 14,
  },
  listLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.outline,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    paddingHorizontal: 2,
  },
  listCards: {
    gap: 12,
  },
  glassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(45, 52, 73, 0.4)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  rankNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.outlineVariant,
    width: 22,
  },
  contenderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  contenderName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  contenderElo: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 3,
  },
  challengeBtn: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  challengeBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  inspireBtn: {
    backgroundColor: 'rgba(234, 195, 74, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  inspireBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default LeaderboardScreen;
