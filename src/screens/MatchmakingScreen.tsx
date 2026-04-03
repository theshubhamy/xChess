import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Animated, Easing } from 'react-native';
import { Colors } from '../theme/colors';

const MatchmakingScreen = ({ navigation, route }: any) => {
  const { mode } = route.params || { mode: 'Blitz' };
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 1000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simulate finding a match after 5 seconds
    const timer = setTimeout(() => {
        navigation.navigate('MatchFound', { opponent: 'Magnus_C', mode: 'Blitz' });
    }, 5000);

    return () => clearTimeout(timer);
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.content}>
        <Text style={styles.modeText}>{mode} Matchmaking</Text>
        
        <View style={styles.animationContainer}>
          <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }], opacity: 0.3 }]} />
          <View style={styles.centerCircle}>
            <View style={styles.avatarLarge} />
          </View>
        </View>
        
        <Text style={styles.statusText}>Searching for an opponent...</Text>
        <Text style={styles.timerText}>Estimated wait: 00:15</Text>
        
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel Matchmaking</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Wait time depends on your ELO rating and online users.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.onSurface,
    marginBottom: 64,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  animationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 64,
  },
  pulseCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.tertiary,
    position: 'absolute',
  },
  centerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.tertiary,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surfaceBright,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.onSurface,
    marginBottom: 8,
  },
  timerText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginBottom: 64,
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  cancelButtonText: {
    color: Colors.onSurfaceVariant,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
});

export default MatchmakingScreen;
