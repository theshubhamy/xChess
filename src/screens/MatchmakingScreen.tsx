import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar, TouchableOpacity, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Zap, User } from 'lucide-react-native';
import { Colors } from '../theme/colors';

const MatchmakingScreen = ({ navigation, route }: any) => {
  const { mode } = route.params || { mode: 'Blitz' };
  const [waitTime, setWaitTime] = useState(0);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const ring1Anim = useRef(new Animated.Value(0.6)).current;
  const ring2Anim = useRef(new Animated.Value(0.35)).current;
  const ring3Anim = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    // Rotate the scan line
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse rings
    const pulseRings = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(ring1Anim, { toValue: 0.2, duration: 2000, useNativeDriver: true }),
          Animated.timing(ring1Anim, { toValue: 0.6, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
    };
    pulseRings();

    // Wait timer
    const timer = setInterval(() =>
      setWaitTime(prev => prev + 1), 1000
    );

    // Auto navigate after 5s for demo
    const navTimer = setTimeout(() => {
      navigation.navigate('MatchFound', { opponent: 'Magnus_C', mode });
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(navTimer);
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.menuIcon}>
            <Zap size={20} color={Colors.tertiary} />
          </View>
          <Text style={styles.brand}>xChess</Text>
        </View>
        <View style={styles.avatarRing}>
          <View style={styles.avatarPlaceholder}>
            <User size={18} color={Colors.onSurfaceVariant} />
          </View>
        </View>
      </View>

      <SafeAreaView style={styles.safeArea} edges={['bottom']}>

        {/* Mode header */}
        <View style={styles.modeHeader}>
          <View style={styles.modeBadge}>
            <Zap size={12} color={Colors.tertiary} />
            <Text style={styles.modeBadgeText}>SELECTED MODE</Text>
          </View>
          <Text style={styles.modeTitle}>{mode} (3|2)</Text>
        </View>

        {/* Central Radar */}
        <View style={styles.radarContainer}>
          {/* Concentric rings */}
          <Animated.View style={[styles.ring, styles.ring1, { opacity: ring1Anim }]} />
          <Animated.View style={[styles.ring, styles.ring2, { opacity: ring2Anim }]} />
          <View style={[styles.ring, styles.ring3]} />

          {/* Pulse glow */}
          <View style={styles.pulseBg} />

          {/* Players Grid */}
          <View style={styles.participantsRow}>
            {/* Left — User */}
            <View style={styles.playerSide}>
              <View style={[styles.playerAvatarWrap, styles.goldBorder]}>
                <View style={styles.playerAvatar}>
                  <User size={36} color={Colors.onSurfaceVariant} />
                </View>
              </View>
              <Text style={styles.playerName}>Grandmaster_Vance</Text>
              <Text style={styles.playerElo}>2150 ELO</Text>
            </View>

            {/* Center — Scanning spinner */}
            <View style={styles.centerScan}>
              <Animated.View style={[styles.spinnerBorder, { transform: [{ rotate: spin }] }]} />
              <User size={32} color={'rgba(234, 195, 74, 0.3)'} />
            </View>

            {/* Right — Opponent placeholder */}
            <View style={styles.playerSide}>
              <View style={[styles.playerAvatarWrap, styles.dashedBorder]}>
                <View style={styles.searchIcon}>
                  <User size={36} color={'rgba(197, 198, 205, 0.3)'} />
                </View>
              </View>
              <Text style={styles.searchingText}>Searching...</Text>
              <Text style={styles.searchingElo}>EST. RANK: 2100–2200</Text>
            </View>
          </View>
        </View>

        {/* Wait Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>WAITING TIME</Text>
            <Text style={styles.statValue}>{formatTime(waitTime)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>PLAYERS ONLINE</Text>
            <Text style={styles.statValueSecondary}>12,842</Text>
          </View>
        </View>

        {/* Cancel Button — ghost border only, no fill */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <X size={20} color={Colors.error} />
            <Text style={styles.cancelBtnText}>CANCEL MATCHMAKING</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const RING_BASE = 300;
const RING2 = 220;
const RING3 = 140;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    paddingTop: 52,
    backgroundColor: Colors.background,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: {
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
    borderColor: 'rgba(69, 71, 76, 0.3)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /* Mode header */
  modeHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1.5,
    borderColor: 'rgba(69, 71, 76, 0.15)',
  },
  modeBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  modeTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -1.5,
  },
  /* Radar */
  radarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(234, 195, 74, 0.2)',
  },
  ring1: {
    width: RING_BASE,
    height: RING_BASE,
  },
  ring2: {
    width: RING2,
    height: RING2,
    opacity: 0.35,
  },
  ring3: {
    width: RING3,
    height: RING3,
    opacity: 0.15,
  },
  pulseBg: {
    position: 'absolute',
    width: RING3 * 0.8,
    height: RING3 * 0.8,
    borderRadius: 999,
    backgroundColor: 'rgba(234, 195, 74, 0.04)',
  },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    width: '100%',
    paddingHorizontal: 20,
  },
  /* Players */
  playerSide: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  playerAvatarWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goldBorder: {
    borderColor: Colors.tertiary,
  },
  dashedBorder: {
    borderColor: 'rgba(69, 71, 76, 0.3)',
    borderStyle: 'dashed',
  },
  playerAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerName: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.onSurface,
    textAlign: 'center',
  },
  playerElo: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.tertiary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  searchingText: {
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'italic',
    color: 'rgba(197, 198, 205, 0.5)',
    textAlign: 'center',
  },
  searchingElo: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(197, 198, 205, 0.35)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  /* Center scanner */
  centerScan: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  spinnerBorder: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.tertiary,
    borderTopColor: 'transparent',
  },
  /* Wait stats */
  statsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 48,
  },
  statBlock: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  statValueSecondary: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.5,
  },
  statDivider: {
    width: 1.5,
    height: 44,
    backgroundColor: 'rgba(69, 71, 76, 0.3)',
  },
  /* Footer */
  footer: {
    paddingHorizontal: 28,
    paddingBottom: 20,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 180, 171, 0.3)',
    gap: 10,
    backgroundColor: 'rgba(255, 180, 171, 0.04)',
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.error,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

export default MatchmakingScreen;
