import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Award, ChevronRight, User } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { getLeaderboard, getCurrentUser, sendFriendRequest } from '../services/auth';
import { ProfileAvatar } from '../components/ProfileAvatar';
import { UserPlus, UserCheck, AlertCircle } from 'lucide-react-native';
import { Alert } from 'react-native';

const LeaderboardScreen = () => {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    fetchLeaders();
  }, []);

  const handleAddFriend = async (leader: any) => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to add friends.');
      return;
    }
    
    if (leader.id === user.uid) return;

    const { error } = await sendFriendRequest(user.uid, user.displayName || user.email?.split('@')[0] || 'Player', leader.id);
    if (error) {
      Alert.alert('Error', error);
    } else {
      Alert.alert('Request Sent', `Friend request sent to ${leader.username}`);
    }
  };

  const fetchLeaders = async () => {
    setLoading(true);
    const data = await getLeaderboard(50);
    setLeaders(data);
    setLoading(false);
  };

  const topThree = leaders.slice(0, 3);
  const others = leaders.slice(3);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.tertiary} />
      </View>
    );
  }

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
            <Text style={styles.heroSub}>THE TOP XCHESS ELITE</Text>
          </View>

          {/* Podium for Top 3 */}
          <View style={styles.podiumSection}>
            {topThree[1] && (
              <View style={[styles.podiumItem, styles.podiumSilver]}>
                <ProfileAvatar iconName={topThree[1].photoURL} size={32} containerSize={72} />
                <Text style={styles.podiumName}>{topThree[1].username}</Text>
                <Text style={styles.podiumElo}>{topThree[1].elo} ELO</Text>
                <Text style={styles.podiumRankLabel}>#2</Text>
              </View>
            )}

            {topThree[0] && (
              <View style={[styles.podiumItem, styles.podiumGold]}>
                <ProfileAvatar iconName={topThree[0].photoURL} size={48} containerSize={88} isGold={true} />
                <Text style={styles.podiumNameGold}>{topThree[0].username}</Text>
                <Text style={styles.podiumEloGold}>{topThree[0].elo} ELO</Text>
                <Text style={styles.podiumRankLabelGold}>#1</Text>
              </View>
            )}

            {topThree[2] && (
              <View style={[styles.podiumItem, styles.podiumBronze]}>
                <ProfileAvatar iconName={topThree[2].photoURL} size={32} containerSize={64} color="#CD7F32" />
                <Text style={styles.podiumName}>{topThree[2].username}</Text>
                <Text style={styles.podiumElo}>{topThree[2].elo} ELO</Text>
                <Text style={styles.podiumRankLabel}>#3</Text>
              </View>
            )}
          </View>

          {/* Leaders List */}
          <View style={styles.leaderList}>
            {others.map((leader, index) => (
              <TouchableOpacity
                key={leader.id || index}
                style={[styles.leaderRow, leader.id === user?.uid && styles.leaderMeRow]}
              >
                <View style={styles.leaderRowLeft}>
                  <Text style={styles.rowRank}>#{index + 4}</Text>
                  <ProfileAvatar iconName={leader.photoURL} size={18} containerSize={36} />
                  <Text style={styles.rowName}>{leader.username}</Text>
                  {leader.id === user?.uid && (
                    <View style={styles.meTag}>
                      <Text style={styles.meTagText}>YOU</Text>
                    </View>
                  )}
                </View>
                <View style={styles.leaderRowRight}>
                  <Text style={styles.rowElo}>{leader.elo}</Text>
                  {leader.id !== user?.uid && (
                    <TouchableOpacity 
                      style={styles.addFriendBtn}
                      onPress={() => handleAddFriend(leader)}
                    >
                      <UserPlus size={18} color={Colors.tertiary} />
                    </TouchableOpacity>
                  )}
                  <ChevronRight size={16} color={Colors.outline} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { justifyContent: 'center', alignItems: 'center' },
  ambientLeft: { position: 'absolute', top: 200, left: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(234, 195, 74, 0.03)' },
  ambientRight: { position: 'absolute', top: 400, right: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(188, 199, 222, 0.03)' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14, borderBottomWidth: 1.5, borderBottomColor: Colors.surfaceContainer },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.surfaceContainerHigh, justifyContent: 'center', alignItems: 'center' },
  pageTitle: { fontSize: 13, fontWeight: '900', color: Colors.onSurfaceVariant, letterSpacing: 2 },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rankLabel: { fontSize: 9, fontWeight: '800', color: Colors.tertiary, letterSpacing: 1.5 },
  avatarGold: { width: 34, height: 34, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.tertiary, justifyContent: 'center', alignItems: 'center' },
  avatarPlaceholder: { width: 28, height: 28, borderRadius: 7, backgroundColor: Colors.surfaceContainerHighest },
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  heroSection: { alignItems: 'center', paddingVertical: 32 },
  heroTitle: { fontSize: 32, fontWeight: '900', color: Colors.onSurface, letterSpacing: -1, marginBottom: 4 },
  heroSub: { fontSize: 10, fontWeight: '800', color: Colors.onSurfaceVariant, letterSpacing: 3 },
  /* Podium */
  podiumSection: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 20, marginBottom: 40, height: 220 },
  podiumItem: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  podiumGold: { transform: [{ scale: 1.1 }], zIndex: 10 },
  podiumSilver: { transform: [{ scale: 0.95 }] },
  podiumBronze: { transform: [{ scale: 0.9 }] },
  podiumAvatar: { borderRadius: 24, marginBottom: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surfaceContainerHigh, borderWidth: 2 },
  avatarGoldLarge: { width: 88, height: 88, borderRadius: 28, borderColor: Colors.tertiary, backgroundColor: 'rgba(234, 195, 74, 0.08)' },
  avatarSilver: { width: 72, height: 72, borderRadius: 22, borderColor: Colors.outline, backgroundColor: 'rgba(188, 199, 222, 0.06)' },
  avatarBronze: { width: 64, height: 64, borderRadius: 20, borderColor: '#CD7F32', backgroundColor: 'rgba(205, 127, 50, 0.06)' },
  podiumNameGold: { fontSize: 16, fontWeight: '900', color: Colors.tertiary, marginBottom: 2 },
  podiumEloGold: { fontSize: 14, fontWeight: '800', color: Colors.onSurface, marginBottom: 8 },
  podiumRankLabelGold: { fontSize: 18, fontWeight: '900', color: Colors.tertiary },
  podiumName: { fontSize: 14, fontWeight: '800', color: Colors.onSurface, marginBottom: 2 },
  podiumElo: { fontSize: 12, fontWeight: '700', color: Colors.onSurfaceVariant, marginBottom: 8 },
  podiumRankLabel: { fontSize: 16, fontWeight: '800', color: Colors.onSurfaceVariant },
  /* List */
  leaderList: { paddingHorizontal: 20, gap: 10 },
  leaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.surfaceContainerLow, padding: 16, borderRadius: 20 },
  leaderMeRow: { backgroundColor: 'rgba(234, 195, 74, 0.08)', borderWidth: 1.5, borderColor: 'rgba(234, 195, 74, 0.2)' },
  leaderRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rowRank: { fontSize: 13, fontWeight: '900', color: Colors.onSurfaceVariant, width: 30 },
  rowAvatar: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.surfaceContainerHighest },
  rowName: { fontSize: 15, fontWeight: '800', color: Colors.onSurface },
  meTag: { backgroundColor: Colors.tertiary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  meTagText: { fontSize: 8, fontWeight: '900', color: Colors.onTertiary },
  leaderRowRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowElo: { fontSize: 13, fontWeight: '900', color: Colors.tertiary, marginRight: 4 },
  addFriendBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(234, 195, 74, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
});

export default LeaderboardScreen;
