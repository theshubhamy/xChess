import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, Bot, Users, ChevronRight, Award } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { getCurrentUser, getUserProfile } from '../services/auth';
import { ProfileAvatar } from '../components/ProfileAvatar';
import { getFirestore, collection, query, where, orderBy, limit, onSnapshot } from '@react-native-firebase/firestore';

const HomeScreen = ({ navigation }: any) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [recentGames, setRecentGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const db = getFirestore();

    const unsubscribeProfile = getUserProfile(user.uid, (profile) => {
      setUserProfile(profile);
    });

    const q = query(
      collection(db, 'games'),
      where('playerUids', 'array-contains', user.uid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribeGames = onSnapshot(q, snap => {
      const games = snap.docs.map(doc => {
        const data = doc.data();
        const isWinner = data.winner === user.uid;
        const isDraw = data.status === 'draw' || data.status === 'stalemate' || data.status === 'draw_accepted';
        const opponentUid = data.playerUids.find((id: string) => id !== user.uid);
        const opponent = data.players?.[opponentUid] || { username: 'Guest', photoURL: 'User' };
        
        const date = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
        const timeStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

        return {
          id: doc.id,
          opponentName: opponent.username,
          opponentPhoto: opponent.photoURL,
          mode: data.mode || 'Blitz',
          result: isDraw ? 'DRAW' : (isWinner ? 'WIN' : 'LOSS'),
          win: isWinner,
          draw: isDraw,
          time: timeStr,
          elo: isWinner ? '+15' : (isDraw ? '+0' : '-12'),
        };
      });
      setRecentGames(games);
      setLoading(false);
    }, err => {
      console.error('Recent games error:', err);
      setLoading(false);
    });

    return () => {
      unsubscribeProfile();
      unsubscribeGames();
    };
  }, []);



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
      <SafeAreaView style={styles.safeArea}>
        {/* Top App Bar */}
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <View style={styles.menuBtn}>
              <Zap size={20} color={Colors.primary} />
            </View>
            <Text style={styles.brandName}>xChess</Text>
          </View>
          <TouchableOpacity
            style={styles.avatarRing}
            onPress={() => navigation.navigate('Profile')}
          >
            <ProfileAvatar iconName={userProfile?.photoURL} size={18} containerSize={38} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Hero: Grandmaster Profile */}
          <View style={styles.heroSection}>
            {/* Background chess piece silhouette */}
            <View style={styles.heroChessBg} />
            <View style={styles.heroContent}>
              <View style={styles.heroAvatarWrapper}>
                <ProfileAvatar 
                  iconName={userProfile?.photoURL} 
                  size={36} 
                  containerSize={88}
                  isGold={userProfile?.rank?.toUpperCase() === 'GRANDMASTER'}
                />
                <View style={styles.gmBadge}>
                  <Text style={styles.gmBadgeText}>{userProfile?.rank?.toUpperCase() === 'GRANDMASTER' ? 'GM' : 'PLY'}</Text>
                </View>
              </View>
              <View style={styles.heroTextGroup}>
                <Text style={styles.heroName}>{userProfile?.username || 'Grandmaster Candidate'}</Text>
                <View style={styles.heroStatsRow}>
                  <View style={styles.heroStatBlock}>
                    <Text style={styles.heroStatLabel}>ELO RATING</Text>
                    <Text style={styles.heroStatValue}>{userProfile?.elo || 1200}</Text>
                  </View>
                  <View style={styles.heroDivider} />
                  <View style={styles.heroStatBlock}>
                    <Text style={styles.heroStatLabel}>WINS</Text>
                    <Text style={styles.heroStatValueSecondary}>{userProfile?.wins || 0}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Game Modes Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>SELECT MODE</Text>
          </View>

          <View style={styles.gameModesGrid}>
            {/* Quick Match — Gold CTA panel (glass gold, no gradient) */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.quickMatchCard}
              onPress={() => navigation.navigate('Matchmaking', { mode: 'Blitz' })}
            >
              <Zap size={36} color={Colors.tertiary} />
              <Text style={styles.quickMatchTitle}>Quick Match</Text>
              <Text style={styles.quickMatchSub}>Random user matchmaking for instant play.</Text>
              <View style={styles.quickMatchArrow}>
                <ChevronRight size={24} color={Colors.tertiary} />
              </View>
            </TouchableOpacity>

            <View style={styles.gameModesPair}>
              {/* Play with AI */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.glassModeCard}
                onPress={() => navigation.navigate('ChessBoard', { isAi: true, mode: 'AI' })}
              >
                <View style={styles.modeIconWrapper}>
                  <Bot size={24} color={Colors.primary} />
                </View>
                <Text style={styles.modeTitle}>Play with AI</Text>
                <Text style={styles.modeSub}>Select difficulty and practice offline.</Text>
              </TouchableOpacity>

              {/* Play with Friend */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.glassModeCard}
                onPress={() => navigation.navigate('FriendsList')}
              >
                <View style={styles.modeIconWrapper}>
                  <Users size={24} color={Colors.primary} />
                </View>
                <Text style={styles.modeTitle}>Play with Friend</Text>
                <Text style={styles.modeSub}>Invite or search friends to challenge.</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Games Section */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>RECENT GAMES</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllBtn}>VIEW HISTORY</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gameList}>
            {recentGames.map((game) => (
              <TouchableOpacity
                key={game.id}
                activeOpacity={0.8}
                style={styles.gameRow}
                onPress={() => navigation.navigate('ChessBoard', { gameId: game.id })}
              >
                <View style={styles.gameRowLeft}>
                  <ProfileAvatar iconName={game.opponentPhoto} size={18} containerSize={48} />
                  <View style={styles.gameInfo}>
                    <View style={styles.gameInfoTop}>
                      <Text style={styles.opponentName}>{game.opponentName}</Text>
                      <View style={styles.modeBadge}>
                        <Text style={styles.modeBadgeText}>{game.mode}</Text>
                      </View>
                    </View>
                    <Text style={styles.gameTime}>{game.time}</Text>
                  </View>
                </View>
                <View style={styles.gameResult}>
                  <Text style={[
                    styles.resultText,
                    game.win ? styles.winText : game.draw ? styles.drawText : styles.lossText
                  ]}>
                    {game.result}
                  </Text>
                  <Text style={[
                    styles.eloText,
                    game.win ? styles.eloPlus : game.draw ? styles.eloDraw : styles.eloMinus
                  ]}>
                    {game.elo} ELO
                  </Text>
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: Colors.background,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.surfaceContainer,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 20,
    fontWeight: '900',
    fontStyle: 'italic',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  avatarRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: 'rgba(234, 195, 74, 0.3)',
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
    paddingBottom: 60,
  },
  /* ---- HERO SECTION ---- */
  heroSection: {
    margin: 20,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 28,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  heroChessBg: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
    backgroundColor: Colors.surfaceContainerHighest,
    opacity: 0.4,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  heroAvatarWrapper: {
    position: 'relative',
  },
  heroAvatar: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 3,
    borderColor: 'rgba(234, 195, 74, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gmBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: Colors.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  gmBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.onTertiary,
    letterSpacing: 1,
  },
  heroTextGroup: {
    flex: 1,
  },
  heroName: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroStatBlock: {
    flex: 1,
  },
  heroStatLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  heroStatValue: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: -0.5,
  },
  heroStatValueSecondary: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onSurface,
    letterSpacing: -0.3,
  },
  heroDivider: {
    width: 1.5,
    height: 32,
    backgroundColor: 'rgba(69, 71, 76, 0.2)',
  },
  /* ---- SECTION HEADERS ---- */
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 14,
    marginTop: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  viewAllBtn: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  /* ---- GAME MODES ---- */
  gameModesGrid: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  /* Quick Match: gold glass panel — no gradient */
  quickMatchCard: {
    backgroundColor: 'rgba(234, 195, 74, 0.08)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.2)',
    position: 'relative',
  },
  quickMatchTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: -0.5,
    marginTop: 16,
    marginBottom: 6,
  },
  quickMatchSub: {
    fontSize: 14,
    color: 'rgba(234, 195, 74, 0.7)',
    fontWeight: '500',
  },
  quickMatchArrow: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  gameModesPair: {
    flexDirection: 'row',
    gap: 16,
  },
  /* AI / Friend glass panels */
  glassModeCard: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 24,
    padding: 20,
    // No borders — tonal shift defines the card
  },
  modeIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.onSurface,
    marginBottom: 6,
  },
  modeSub: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 17,
  },
  /* ---- RECENT GAMES LIST ---- */
  gameList: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 20,
  },
  gameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 20,
    padding: 16,
  },
  gameRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  opponentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  gameInfo: {
    flex: 1,
  },
  gameInfoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  opponentName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.onSurface,
    letterSpacing: -0.3,
  },
  modeBadge: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  modeBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  gameTime: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    fontWeight: '500',
    opacity: 0.7,
  },
  gameResult: {
    alignItems: 'flex-end',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  winText: { color: Colors.tertiary },
  lossText: { color: Colors.error },
  drawText: { color: Colors.onSurface },
  eloText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  eloPlus: { color: Colors.onSurfaceVariant },
  eloMinus: { color: Colors.onSurfaceVariant },
  eloDraw: { color: Colors.onSurfaceVariant },
});

export default HomeScreen;
