import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';

const MatchFoundScreen = ({ navigation, route }: any) => {
  const { opponent, mode } = route.params || { opponent: 'Magnus_C', mode: 'Blitz' };
  const [countdown, setCountdown] = useState(3);

  const player1ScaleAnim = useRef(new Animated.Value(0)).current;
  const player2ScaleAnim = useRef(new Animated.Value(0)).current;
  const vsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.spring(player1ScaleAnim, { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }),
      Animated.spring(player2ScaleAnim, { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }),
    ]).start();

    Animated.timing(vsAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      delay: 500,
    }).start();

    // Countdown timer
    const countInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const timer = setTimeout(() => {
      navigation.navigate('ChessBoard', { opponent, mode: mode || 'Blitz' });
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearInterval(countInterval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Ambient glow */}
      <View style={styles.ambientGlow} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.brandName}>xChess</Text>
      </View>

      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.matchFoundTitle}>Match Found</Text>
          <Text style={styles.preparingText}>PREPARING THE GRANDMASTER BOARD</Text>
        </View>

        {/* VS Section */}
        <View style={styles.vsSection}>
          {/* Player 1 */}
          <Animated.View style={[styles.playerSlot, { transform: [{ scale: player1ScaleAnim }] }]}>
            <View style={styles.playerLayout}>
              <Text style={styles.playerName}>Grandmaster Vance</Text>
              <View style={styles.eloRow}>
                <Text style={styles.eloValue}>2150 ELO</Text>
              </View>
            </View>
            <View style={styles.playerAvatarWrap}>
              <View style={[styles.playerAvatar, styles.avatarWhite]} />
              <View style={styles.pieceColorBadge}>
                <Text style={styles.pieceColorText}>WHITE</Text>
              </View>
            </View>
          </Animated.View>

          {/* Countdown Circle */}
          <Animated.View style={[styles.countdownWrap, { opacity: vsAnim, transform: [{ scale: vsAnim }] }]}>
            <View style={styles.countdownCircle}>
              <Text style={styles.countdownNumber}>{countdown > 0 ? countdown : '!'}</Text>
              <Text style={styles.countdownLabel}>SECONDS</Text>
            </View>
            {/* Vertical connector */}
            <View style={styles.verticalLine} />
          </Animated.View>

          {/* Player 2 */}
          <Animated.View style={[styles.playerSlot, styles.playerSlotRight, { transform: [{ scale: player2ScaleAnim }] }]}>
            <View style={[styles.playerAvatarWrap, styles.avatarRight]}>
              <View style={[styles.playerAvatar, styles.avatarDark]} />
              <View style={[styles.pieceColorBadge, styles.pieceColorBadgeDark]}>
                <Text style={styles.pieceColorText}>BLACK</Text>
              </View>
            </View>
            <View style={[styles.playerLayout, styles.playerLayoutRight]}>
              <Text style={styles.playerName}>{opponent}</Text>
              <View style={styles.eloRow}>
                <Text style={styles.eloValueGold}>2860 ELO</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Match Info Tag */}
        <View style={styles.matchInfoRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.matchInfoText}>Rated Match • Standard {mode || 'Blitz'}</Text>
        </View>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() => navigation.navigate('ChessBoard', { opponent, mode })}
          >
            <Text style={styles.acceptBtnText}>ACCEPT BATTLE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.declineBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.declineBtnText}>DECLINE (30s cooldown)</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  ambientGlow: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    marginLeft: -120,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(234, 195, 74, 0.04)',
    zIndex: 0,
  },
  topBar: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 8,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  brandName: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: -0.5,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    gap: 8,
  },
  matchFoundTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -1.5,
    textTransform: 'uppercase',
  },
  preparingText: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(234, 195, 74, 0.8)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  /* VS Section */
  vsSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  playerSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    width: '100%',
    justifyContent: 'flex-end',
    paddingRight: 24,
  },
  playerSlotRight: {
    justifyContent: 'flex-start',
    paddingRight: 0,
    paddingLeft: 24,
  },
  playerLayout: {
    alignItems: 'flex-end',
  },
  playerLayoutRight: {
    alignItems: 'flex-start',
  },
  playerName: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.5,
  },
  eloRow: {
    marginTop: 6,
  },
  eloValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  eloValueGold: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.tertiary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  playerAvatarWrap: {
    position: 'relative',
    alignItems: 'center',
  },
  avatarRight: {
    alignItems: 'center',
  },
  playerAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
  },
  avatarWhite: {
    backgroundColor: Colors.surfaceContainerHighest,
    borderColor: 'rgba(216, 227, 251, 0.3)',
  },
  avatarDark: {
    backgroundColor: Colors.surfaceContainerHighest,
    borderColor: 'rgba(234, 195, 74, 0.3)',
  },
  pieceColorBadge: {
    position: 'absolute',
    top: -14,
    backgroundColor: Colors.onSurface,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  pieceColorBadgeDark: {
    backgroundColor: Colors.surfaceContainerHighest,
  },
  pieceColorText: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.background,
    letterSpacing: 2,
  },
  /* Countdown */
  countdownWrap: {
    alignItems: 'center',
    position: 'relative',
  },
  countdownCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(49, 57, 77, 0.6)',
    borderWidth: 2,
    borderColor: 'rgba(234, 195, 74, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: -1,
  },
  countdownLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(234, 195, 74, 0.7)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: -4,
  },
  verticalLine: {
    position: 'absolute',
    width: 1,
    height: 200,
    backgroundColor: 'rgba(234, 195, 74, 0.2)',
    zIndex: -1,
    top: '50%',
  },
  /* Match info pill */
  matchInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 999,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(69, 71, 76, 0.1)',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.tertiary,
  },
  matchInfoText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  /* Footer */
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
    alignItems: 'center',
  },
  acceptBtn: {
    width: '100%',
    height: 62,
    backgroundColor: 'rgba(234, 195, 74, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.35)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  declineBtn: {
    paddingVertical: 10,
  },
  declineBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(197, 198, 205, 0.5)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

export default MatchFoundScreen;
