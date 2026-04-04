import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Zap, Bot, Users, ChevronRight } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { getCurrentUser, getUserProfile } from '../services/auth';
import { ProfileAvatar } from '../components/ProfileAvatar';
import { listenToRecentGames } from '../services/multiplayer';

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

    const unsubscribeProfile = getUserProfile(user.uid, (profile) => {
      setUserProfile(profile);
    });

    const unsubscribeGames = listenToRecentGames(user.uid, (games) => {
      setRecentGames(games);
      setLoading(false);
    }, 5);

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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero: Grandmaster Profile */}
        <View style={styles.heroSection}>
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
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 110, // Account for floating tab bar
  },
  heroSection: {
    margin: 20,
    marginTop: 10,
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
  gameModesGrid: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
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
  glassModeCard: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 24,
    padding: 20,
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
  eloPlus: { color: 'rgba(234, 195, 74, 0.6)' },
  eloMinus: { color: 'rgba(188, 199, 222, 0.4)' },
  eloDraw: { color: 'rgba(188, 199, 222, 0.4)' },
});

export default HomeScreen;
