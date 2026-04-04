import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { Colors } from '../theme/colors';

const SignUpScreen = ({ navigation }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={22} color={Colors.onSurface} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Hero Branding Banner */}
          <View style={styles.heroBanner}>
            <View style={styles.heroInner}>
              <Text style={styles.heroEmoji}>♟♞♝</Text>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={styles.pageTitle}>Create Account</Text>
            <Text style={styles.pageSubtitle}>
              Join the elite circle of Grandmasters and track your journey to the top.
            </Text>

            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>FULL NAME</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={Colors.outline}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>EMAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="example@mail.com"
                placeholderTextColor={Colors.outline}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>PASSWORD</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Min. 8 characters"
                  placeholderTextColor={Colors.outline}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  {showPassword
                    ? <EyeOff size={20} color={Colors.outline} />
                    : <Eye size={20} color={Colors.outline} />
                  }
                </TouchableOpacity>
              </View>
            </View>

            {/* Primary CTA — glass gold, no gradient */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.signUpButton}
              onPress={() => navigation.navigate('MainApp')}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>𝗚 Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>  Apple</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signInLink}>
                Already have an account?{' '}
                <Text style={styles.signInLinkBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By signing up, you agree to the{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>,
              {' '}including cookie use.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.surface,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 50,
  },
  heroBanner: {
    height: 200,
    backgroundColor: Colors.surfaceContainer,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 24,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  heroEmoji: {
    fontSize: 48,
    opacity: 0.4,
    letterSpacing: 8,
  },
  formSection: {
    paddingHorizontal: 20,
    paddingTop: 28,
    gap: 6,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -1,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: Colors.onSurface,
    // Sleek input: Ghost bottom border replaces full border
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(69, 71, 76, 0.3)',
  },
  passwordWrapper: {
    position: 'relative',
  },
  passwordInput: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 52,
    fontSize: 15,
    color: Colors.onSurface,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(69, 71, 76, 0.3)',
  },
  eyeBtn: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  signUpButton: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    backgroundColor: 'rgba(234, 195, 74, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  signUpButtonText: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 1,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(69, 71, 76, 0.3)',
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  socialButton: {
    flex: 1,
    height: 56,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(69, 71, 76, 0.15)',
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  signInLink: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginTop: 8,
  },
  signInLinkBold: {
    fontWeight: '900',
    color: Colors.tertiary,
  },
  termsText: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.outline,
    lineHeight: 17,
    marginTop: 16,
    paddingBottom: 20,
  },
  termsLink: {
    color: Colors.onSurface,
  },
});

export default SignUpScreen;
