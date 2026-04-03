import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { Search, Shield, Target, X } from 'lucide-react-native';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const MatchmakingScreen = ({ navigation, route }: any) => {
  const { mode } = route.params || { mode: 'Blitz' };
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 8000, useNativeDriver: true })
    ).start();

    // Auto navigate after 5s for demo
    const timer = setTimeout(() => {
      navigation.navigate('MatchFound', { opponent: 'Magnus_C', mode });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.modeLabel}>{mode.toUpperCase()} ARENA</Text>
            <Text style={styles.title}>MATCHMAKING</Text>
          </View>

          <View style={styles.radarContainer}>
            <Animated.View style={[styles.pulse, { transform: [{ scale: pulseAnim }], opacity: 0.3 }]} />
            <Animated.View style={[styles.pulse, { transform: [{ scale: Animated.multiply(pulseAnim, 0.8) }], opacity: 0.1 }]} />
            
            <View style={styles.glassRadarWrapper}>
              <Animated.View style={[styles.radarLine, { transform: [{ rotate: spin }] }]} />
              <View style={styles.glassRadarCenter}>
                <View style={styles.userAvatar}>
                  <Text style={styles.avatarInitial}>V</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.statusSection}>
            <View style={styles.glassStatusCard}>
              <View style={styles.statusRow}>
                <Search size={16} color={Colors.tertiary} />
                <Text style={styles.statusText}>Searching for peer competitors...</Text>
              </View>
              <Text style={styles.timeElapsed}>00:42 ELAPSED</Text>
            </View>

            <View style={styles.matchStats}>
              <View style={styles.glassMatchStat}>
                <Shield size={18} color={Colors.onSurfaceVariant} />
                <Text style={styles.matchStatText}>FAIR PLAY ON</Text>
              </View>
              <View style={styles.glassMatchStat}>
                <Target size={18} color={Colors.onSurfaceVariant} />
                <Text style={styles.matchStatText}>±50 ELO RANGE</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.cancelGlassButton}
              onPress={() => navigation.goBack()}
            >
              <X size={20} color={Colors.onSurfaceVariant} />
              <Text style={styles.cancelButtonText}>ABANDON SEARCH</Text>
            </TouchableOpacity>
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
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
  },
  modeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.tertiary,
    letterSpacing: 4,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: 2,
  },
  radarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: width,
  },
  pulse: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: Colors.tertiary,
  },
  glassRadarWrapper: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width * 0.375,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  radarLine: {
    position: 'absolute',
    width: width * 0.375,
    height: 2,
    backgroundColor: Colors.tertiary,
    top: width * 0.375,
    left: width * 0.375,
    transformOrigin: 'left',
  },
  glassRadarCenter: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: Colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.onTertiary,
  },
  statusSection: {
    paddingHorizontal: 30,
    gap: 20,
  },
  glassStatusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  timeElapsed: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
  },
  matchStats: {
    flexDirection: 'row',
    gap: 12,
  },
  glassMatchStat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  matchStatText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  footer: {
    paddingHorizontal: 30,
  },
  cancelGlassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 10,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
  },
});

export default MatchmakingScreen;
