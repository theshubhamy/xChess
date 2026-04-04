import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { GlassCard } from '../components/common/GlassCard';

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Ambient light blobs — via tonal surfaces, no gradients */}
        <View style={styles.ambientTopRight} />
        <View style={styles.ambientBottomLeft} />

        <View style={styles.content}>
          {/* Logo & Brand */}
          <View style={styles.brandSection}>
            <Text style={styles.brandLogo}>
              <Text style={{ color: '#FFFFFF' }}>x</Text>
              <Text style={{ color: Colors.tertiary }}>Chess</Text>
            </Text>
            <Text style={styles.brandTagline}>THE GRANDMASTER'S STUDY</Text>
          </View>

          {/* Hero Chess Piece Area — glass card placeholder */}
          <View style={styles.heroContainer}>
            <View style={styles.heroCard}>
              {/* Piece silhouette via elevated tonal surface */}
              <View style={styles.heroInner}>
                <Text style={styles.heroEmoji}>♛</Text>
              </View>
            </View>
            {/* Premium Badge Overlay */}
            <GlassCard style={styles.premiumBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.premiumText}>EXPERIENCE ELITE PLAY</Text>
            </GlassCard>
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <PrimaryButton
              title="GET STARTED"
              onPress={() => navigation.navigate('SignUp')}
              icon={<ArrowRight size={20} color={Colors.onTertiary} />}
              style={styles.mainBtn}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.signInRow}
            >
              <Text style={styles.signInText}>Already a member? </Text>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Editorial Footer Quote */}
          <View style={styles.quoteSection}>
            <Text style={styles.quote}>"Chess is the gymnasium of the mind."</Text>
            <Text style={styles.quoteAuthor}>— BLAISE PASCAL</Text>
          </View>
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
  },
  /* Ambient decorative using tonal surfaces — no gradients */
  ambientTopRight: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(234, 195, 74, 0.04)',
  },
  ambientBottomLeft: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(188, 199, 222, 0.04)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 32,
  },
  /* Brand */
  brandSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  brandLogo: {
    fontSize: 72,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: -3,
    lineHeight: 76,
  },
  brandTagline: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    letterSpacing: 4,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  /* Hero glass card */
  heroContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  heroCard: {
    width: 260,
    height: 320,
    borderRadius: 48,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(69, 71, 76, 0.15)',
  },
  heroInner: {
    width: 200,
    height: 240,
    borderRadius: 36,
    backgroundColor: Colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 100,
    color: Colors.tertiary,
    opacity: 0.7,
  },
  premiumBadge: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.tertiary,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.onSurface,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  /* CTA */
  ctaSection: {
    width: '100%',
    gap: 20,
    alignItems: 'center',
  },
  mainBtn: {
    width: '100%',
    height: 64,
    backgroundColor: 'rgba(234, 195, 74, 0.12)',
    borderColor: 'rgba(234, 195, 74, 0.35)',
    borderWidth: 1.5,
    borderRadius: 22,
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    fontWeight: '500',
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.onSurface,
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(234, 195, 74, 0.4)',
  },
  /* Editorial Quote */
  quoteSection: {
    alignItems: 'center',
    opacity: 0.4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(69, 71, 76, 0.15)',
    paddingTop: 20,
    width: '100%',
  },
  quote: {
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: '500',
    color: Colors.onSurface,
    textAlign: 'center',
    lineHeight: 20,
  },
  quoteAuthor: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: 2,
    marginTop: 8,
  },
});

export default WelcomeScreen;
