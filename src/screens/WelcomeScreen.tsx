import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions, SafeAreaView } from 'react-native';
import { Colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <View style={styles.glassLogo}>
                <Text style={styles.logoText}>X</Text>
              </View>
            </View>
          </View>

          <View style={styles.textSection}>
            <Text style={styles.headline}>The Gymnasium{"\n"}of the Mind</Text>
            <Text style={styles.subheadline}>
              Ascend the rankings in the world’s most sophisticated chess sanctuary.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('SignUp')}
            >
              <View style={styles.primaryGlassButton}>
                <Text style={styles.primaryButtonText}>START JOURNEY</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.secondaryButtonText}>SIGN IN TO ACCOUNT</Text>
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
    paddingVertical: 60,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassLogo: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 60,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: -5,
  },
  textSection: {
    paddingHorizontal: 30,
  },
  headline: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 56,
    letterSpacing: -1,
  },
  subheadline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 16,
    lineHeight: 28,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 30,
    gap: 16,
  },
  primaryGlassButton: {
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(234, 195, 74, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 2,
  },
  secondaryButton: {
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1.5,
  },
});

export default WelcomeScreen;
