import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, StatusBar, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { signUp, signInWithGoogle } from '../services/auth';

const SignUpScreen = ({ navigation }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Validation ──────────────────────────────────────────────────────────
  const validate = (): string | null => {
    if (!name.trim()) return 'Please enter your full name.';
    if (!email.trim()) return 'Please enter your email address.';
    if (!/\S+@\S+\.\S+/.test(email.trim())) return 'Please enter a valid email address.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  };

  // ── Email Sign-Up ───────────────────────────────────────────────────────
  const handleSignUp = async () => {
    setError('');
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    const { error: err } = await signUp(email.trim(), password, name.trim());
    setLoading(false);

    if (err) {
      setError(err);
    }
    // AppNavigator's auth listener handles navigation on success
  };

  // ── Google Sign-Up ──────────────────────────────────────────────────────
  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);
    const { error: err } = await signInWithGoogle();
    setGoogleLoading(false);
    if (err && err !== 'Sign-in was cancelled.') {
      setError(err);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ArrowLeft size={22} color={Colors.onSurface} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Hero Banner */}
            <View style={styles.heroBanner}>
              <View style={styles.heroInner}>
                <Text style={styles.heroEmoji}>♟♞♝</Text>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.pageTitle}>Create Account</Text>
              <Text style={styles.pageSubtitle}>
                Join the elite circle of Grandmasters and track your journey to the top.
              </Text>

              {/* ── Google Sign-Up ──────────────────────────────────────── */}
              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleSignUp}
                disabled={googleLoading || loading}
                activeOpacity={0.88}
              >
                {googleLoading ? (
                  <ActivityIndicator size="small" color="#1a1a1a" />
                ) : (
                  <>
                    <View style={styles.googleLogo}>
                      <Text style={styles.googleLogoText}>G</Text>
                    </View>
                    <Text style={styles.googleText}>Continue with Google</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR SIGN UP WITH EMAIL</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* ── Full Name ───────────────────────────────────────────── */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>FULL NAME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor={Colors.outline}
                  value={name}
                  onChangeText={t => { setName(t); setError(''); }}
                  returnKeyType="next"
                />
              </View>

              {/* ── Email ───────────────────────────────────────────────── */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>EMAIL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="example@mail.com"
                  placeholderTextColor={Colors.outline}
                  value={email}
                  onChangeText={t => { setEmail(t); setError(''); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>

              {/* ── Password ─────────────────────────────────────────────── */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>PASSWORD</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Min. 6 characters"
                    placeholderTextColor={Colors.outline}
                    value={password}
                    onChangeText={t => { setPassword(t); setError(''); }}
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleSignUp}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(s => !s)}
                    style={styles.eyeBtn}
                  >
                    {showPassword
                      ? <EyeOff size={20} color={Colors.outline} />
                      : <Eye size={20} color={Colors.outline} />}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Error Banner */}
              {!!error && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* ── Primary CTA ─────────────────────────────────────────── */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.signUpButton, (loading || googleLoading) && styles.buttonDisabled]}
                onPress={handleSignUp}
                disabled={loading || googleLoading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.tertiary} />
                ) : (
                  <Text style={styles.signUpButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>

              {/* Sign In Link */}
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
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
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
  scrollContent: { paddingBottom: 50 },
  heroBanner: { height: 200, backgroundColor: Colors.surfaceContainer },
  heroInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 24,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  heroEmoji: { fontSize: 48, opacity: 0.4, letterSpacing: 8 },
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
    marginBottom: 20,
  },
  /* Google */
  googleButton: {
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  googleLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleLogoText: { fontSize: 14, fontWeight: '900', color: '#fff' },
  googleText: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  /* Divider */
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(69, 71, 76, 0.3)' },
  dividerText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  /* Fields */
  fieldGroup: { marginBottom: 16 },
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
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(69, 71, 76, 0.3)',
  },
  passwordWrapper: { position: 'relative' },
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
  eyeBtn: { position: 'absolute', right: 16, top: 16 },
  /* Error */
  errorBanner: {
    backgroundColor: 'rgba(255, 180, 171, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 180, 171, 0.25)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
  },
  errorText: { fontSize: 13, color: Colors.error, fontWeight: '600', lineHeight: 20 },
  /* CTA */
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
    marginBottom: 16,
  },
  buttonDisabled: { opacity: 0.6 },
  signUpButtonText: { fontSize: 17, fontWeight: '900', color: Colors.tertiary, letterSpacing: 1 },
  signInLink: { textAlign: 'center', fontSize: 14, color: Colors.onSurfaceVariant, marginTop: 4 },
  signInLinkBold: { fontWeight: '900', color: Colors.tertiary },
  termsText: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.outline,
    lineHeight: 17,
    marginTop: 16,
    paddingBottom: 20,
  },
  termsLink: { color: Colors.onSurface },
});

export default SignUpScreen;
