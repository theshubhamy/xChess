import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';
import { getLeaderboard } from '../services/auth';
import { ProfileAvatar } from '../components/ProfileAvatar';
import { GlassCard } from '../components/common/GlassCard';

const LeaderboardScreen = ({ navigation }: any) => {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    setLoading(true);
    const data = await getLeaderboard(50);
    setLeaders(data);
    setLoading(false);
  };

  const topThree = leaders.slice(0, 3);
  const others = leaders; // We will render all in the list for a clean scroll

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.tertiary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Rankings Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.eyebrow}>WORLDWIDE RANKINGS</Text>
          <Text style={styles.pageTitle}>Leaderboard</Text>
        </View>

        {/* Podium Section */}
        <View style={styles.podiumContainer}>
          {topThree[1] && (
            <View style={[styles.podiumItem, styles.podiumSecond]}>
              <ProfileAvatar iconName={topThree[1].photoURL} size={28} containerSize={74} />
              <View style={[styles.rankCircle, styles.rankSecond]}>
                <Text style={styles.rankNum}>2</Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{topThree[1].username}</Text>
              <Text style={styles.podiumElo}>{topThree[1].elo}</Text>
            </View>
          )}

          {topThree[0] && (
            <View style={[styles.podiumItem, styles.podiumFirst]}>
              <View style={styles.crownWrap}>
                <Text style={styles.crown}>👑</Text>
              </View>
              <ProfileAvatar iconName={topThree[0].photoURL} size={36} containerSize={94} isGold={true} />
              <View style={[styles.rankCircle, styles.rankFirst]}>
                <Text style={styles.rankNum}>1</Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{topThree[0].username}</Text>
              <Text style={styles.podiumEloFirst}>{topThree[0].elo}</Text>
            </View>
          )}

          {topThree[2] && (
            <View style={[styles.podiumItem, styles.podiumThird]}>
              <ProfileAvatar iconName={topThree[2].photoURL} size={28} containerSize={74} />
              <View style={[styles.rankCircle, styles.rankThird]}>
                <Text style={styles.rankNum}>3</Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{topThree[2].username}</Text>
              <Text style={styles.podiumElo}>{topThree[2].elo}</Text>
            </View>
          )}
        </View>

        {/* Rankings List */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>TOP 50 GRANDMASTERS</Text>
          {leaders.map((item, index) => (
            <GlassCard key={item.id} style={styles.leaderRow}>
              <View style={styles.rowLeft}>
                <Text style={styles.rankIndex}>#{index + 1}</Text>
                <ProfileAvatar iconName={item.photoURL} size={16} containerSize={44} />
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{item.username}</Text>
                  <Text style={styles.playerRank}>{item.rank || 'Master'}</Text>
                </View>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.eloValue}>{item.elo}</Text>
                <Text style={styles.eloLabel}>ELO</Text>
              </View>
            </GlassCard>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingTop: 10, paddingBottom: 120 },
  pageHeader: { paddingHorizontal: 24, paddingTop: 10, marginBottom: 24 },
  eyebrow: { fontSize: 10, fontWeight: '900', color: Colors.onSurfaceVariant, letterSpacing: 3, marginBottom: 8 },
  pageTitle: { fontSize: 32, fontWeight: '900', color: Colors.onSurface, letterSpacing: -1 },
  podiumContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 20, marginBottom: 40, height: 220 },
  podiumItem: { alignItems: 'center', width: '30%' },
  podiumFirst: { transform: [{ translateY: -20 }] },
  podiumSecond: { transform: [{ translateX: 10 }] },
  podiumThird: { transform: [{ translateX: -10 }] },
  podiumName: { fontSize: 14, fontWeight: '800', color: Colors.onSurface, marginTop: 12, textAlign: 'center' },
  podiumElo: { fontSize: 12, fontWeight: '700', color: Colors.onSurfaceVariant, marginTop: 2 },
  podiumEloFirst: { fontSize: 15, fontWeight: '900', color: Colors.tertiary, marginTop: 2 },
  crownWrap: { position: 'absolute', top: -25, zIndex: 10 },
  crown: { fontSize: 24 },
  rankCircle: { position: 'absolute', bottom: 45, width: 24, height: 24, borderRadius: 12, borderColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  rankFirst: { backgroundColor: Colors.tertiary },
  rankSecond: { backgroundColor: Colors.primary },
  rankThird: { backgroundColor: '#CD7F32' },
  rankNum: { fontSize: 11, fontWeight: '900', color: Colors.background },
  listSection: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 11, fontWeight: '900', color: Colors.onSurfaceVariant, letterSpacing: 2, marginBottom: 20 },
  leaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 24, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(69, 71, 76, 0.15)' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rankIndex: { fontSize: 13, fontWeight: '900', color: Colors.onSurfaceVariant, width: 30 },
  playerInfo: { gap: 2 },
  playerName: { fontSize: 16, fontWeight: '800', color: Colors.onSurface },
  playerRank: { fontSize: 11, fontWeight: '700', color: Colors.onSurfaceVariant, opacity: 0.6 },
  rowRight: { alignItems: 'flex-end' },
  eloValue: { fontSize: 18, fontWeight: '900', color: Colors.onSurface, letterSpacing: -0.5 },
  eloLabel: { fontSize: 9, fontWeight: '800', color: Colors.onSurfaceVariant, opacity: 0.5 },
});

export default LeaderboardScreen;
