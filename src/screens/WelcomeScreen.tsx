import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Colors } from '../theme/colors';

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          {/* Logo Placeholder */}
          <Text style={styles.logoText}>xChess</Text>
        </View>
        
        <View style={styles.heroSection}>
          <Text style={styles.tagline}>The Gymnasium of the Mind</Text>
          <Text style={styles.subtext}>Challenge friends, AI, or the world in a premium chess experience.</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.quote}>"Chess is the gymnasium of the mind."</Text>
        <Text style={styles.author}>— Blaise Pascal</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 48,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.tertiary,
    letterSpacing: -2,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 64,
  },
  tagline: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtext: {
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: Colors.tertiary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.tertiary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onTertiary,
  },
  secondaryButton: {
    backgroundColor: Colors.surfaceContainer,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  quote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  author: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
});

export default WelcomeScreen;
