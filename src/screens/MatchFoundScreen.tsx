import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, Swords, Star, ChevronRight } from 'lucide-react-native';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const MatchFoundScreen = ({ navigation, route }: any) => {
  const { opponent, mode } = route.params || { opponent: 'Magnus_C', mode: 'Blitz' };
  
  const scaleAnim = [new Animated.Value(0), new Animated.Value(0)];
  const vsAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.stagger(200, [
      Animated.spring(scaleAnim[0], { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }),
      Animated.spring(scaleAnim[1], { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }),
    ]).start();

    Animated.timing(vsAnim, { toValue: 1, duration: 800, useNativeDriver: true, delay: 600 }).start();

    const timer = setTimeout(() => {
      navigation.navigate('ChessBoard', { opponent });
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const renderPlayer = (name: string, elo: string, index: number) => (
    <Animated.View style={[styles.playerContainer, { transform: [{ scale: scaleAnim[index] }] }]}>
      <View style={styles.glassAvatarWrapper}>
        <View style={styles.avatarInner} />
      </View>
      <Text style={styles.playerName}>{name.toUpperCase()}</Text>
      <Text style={styles.playerElo}>{elo} ELO</Text>
      <View style={styles.badgeRow}>
        <Shield size={14} color={Colors.tertiary} />
        <Star size={14} color={Colors.tertiary} />
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.modeTitle}>{mode.toUpperCase()} MATCH FOUND</Text>
            <View style={styles.glazeBar} />
          </View>

          <View style={styles.battleView}>
            {renderPlayer('Grandmaster Vance', '2150', 0)}
            
            <Animated.View style={[styles.vsContainer, { opacity: vsAnim, transform: [{ scale: vsAnim }] }]}>
              <View style={styles.glassVs}>
                <Swords size={32} color={Colors.tertiary} />
              </View>
              <Text style={styles.vsText}>VS</Text>
            </Animated.View>

            {renderPlayer(opponent, '2860', 1)}
          </View>

          <View style={styles.footer}>
            <View style={styles.glassInfoBox}>
              <Text style={styles.infoText}>Duel initiating in 3 seconds...</Text>
              <View style={styles.loadingBar}>
                <View style={styles.loadingProgress} />
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
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  header: {
    alignItems: 'center',
    gap: 16,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: 4,
  },
  glazeBar: {
    width: 60,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
  },
  battleView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  playerContainer: {
    alignItems: 'center',
  },
  glassAvatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 6,
    marginBottom: 16,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  playerName: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: 1,
    marginBottom: 4,
  },
  playerElo: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontWeight: '800',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  vsContainer: {
    alignItems: 'center',
    gap: 12,
  },
  glassVs: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsText: {
    fontSize: 24,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 2,
  },
  footer: {
    paddingHorizontal: 40,
  },
  glassInfoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    marginBottom: 16,
  },
  loadingBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  loadingProgress: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.tertiary,
  },
});

export default MatchFoundScreen;
