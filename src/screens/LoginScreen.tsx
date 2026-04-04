import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  StatusBar, ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Eye, EyeOff } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { login, signInWithGoogle, sendPasswordReset } from '../services/auth';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Email / Password ────────────────────────────────────────────────────
  const handleLogin = async () => {
    setError('');
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!password) { setError('Please enter your password.'); return; }

    setLoading(true);
    const { error: err } = await login(email.trim(), password);
    setLoading(false);

    if (err) {
      setError(err);
    }
    // Auth state listener in AppNavigator will auto-navigate on success
  };

  // ── Google Sign-In ──────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    const { error: err } = await signInWithGoogle();
    setGoogleLoading(false);
    if (err && err !== 'Sign-in was cancelled.') {
      setError(err);
    }
  };

  // ── Forgot Password ─────────────────────────────────────────────────────
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Enter your email', 'Type your email above and tap Forgot Password to reset it.');
      return;
    }
    const { error: err } = await sendPasswordReset(email.trim());
    if (err) {
      Alert.alert('Error', err);
    } else {
      Alert.alert('Email Sent', `Password reset instructions sent to ${email}.`);
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
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              {/* Branding */}
              <View style={styles.brandRow}>
                <Text style={styles.brand}>
                  x<Text style={styles.brandGold}>Chess</Text>
                </Text>
              </View>

              {/* Header */}
              <View style={styles.headerBlock}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Please enter your details to sign in.</Text>
              </View>

              {/* ── Google Sign-In ───────────────────────────────────────── */}
              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
                disabled={googleLoading || loading}
                activeOpacity={0.88}
              >
                {googleLoading ? (
                  <ActivityIndicator size="small" color="#1a1a1a" />
                ) : (
                  <>
                    {/* Google "G" logo rendered in-code */}
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
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* ── Email / Password Form ────────────────────────────────── */}
              <View style={styles.form}>
                {/* Email */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Email address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="name@company.com"
                    placeholderTextColor="rgba(197, 198, 205, 0.4)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={t => { setEmail(t); setError(''); }}
                    returnKeyType="next"
                  />
                </View>

                {/* Password */}
                <View style={styles.fieldGroup}>
                  <View style={styles.passwordLabelRow}>
                    <Text style={styles.fieldLabel}>Password</Text>
                    <TouchableOpacity onPress={handleForgotPassword}>
                      <Text style={styles.forgotLink}>Forgot Password?</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.passwordWrapper}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="••••••••"
                      placeholderTextColor="rgba(197, 198, 205, 0.4)"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={t => { setPassword(t); setError(''); }}
                      returnKeyType="done"
                      onSubmitEditing={handleLogin}
                    />
                    <TouchableOpacity
                      style={styles.eyeBtn}
                      onPress={() => setShowPassword(s => !s)}
                    >
                      {showPassword
                        ? <EyeOff size={20} color={Colors.outline} />
                        : <Eye size={20} color={Colors.outline} />}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Error message */}
                {!!error && (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                {/* CTA */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.signInButton, (loading || googleLoading) && styles.buttonDisabled]}
                  onPress={handleLogin}
                  disabled={loading || googleLoading}
                >
                  {loading ? (
                    <ActivityIndicator color={Colors.tertiary} />
                  ) : (
                    <>
                      <Text style={styles.signInButtonText}>Sign In</Text>
                      <ArrowRight size={20} color={Colors.tertiary} />
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.signUpText}>
                  Don't have an account?{' '}
                  <Text
                    style={styles.signUpLink}
                    onPress={() => navigation.navigate('SignUp')}
                  >
                    Create an Account
                  </Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  content: {
    paddingHorizontal: 28,
    paddingVertical: 32,
  },
  /* Brand */
  brandRow: { alignItems: 'center', marginBottom: 40 },
  brand: { fontSize: 32, fontWeight: '900', color: Colors.onSurface, letterSpacing: -1 },
  brandGold: { color: Colors.tertiary },
  /* Header */
  headerBlock: { marginBottom: 28 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.onSurface, letterSpacing: -0.5, marginBottom: 6 },
  subtitle: { fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 20 },
  /* Google */
  googleButton: {
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
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
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(69, 71, 76, 0.3)' },
  dividerText: { fontSize: 11, color: Colors.onSurfaceVariant, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 2 },
  /* Form */
  form: { gap: 16, marginBottom: 28 },
  fieldGroup: { gap: 8 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: Colors.onSurfaceVariant, letterSpacing: 0.5 },
  passwordLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgotLink: { fontSize: 12, fontWeight: '700', color: Colors.tertiary },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: Colors.onSurface,
    borderWidth: 1.5,
    borderColor: 'rgba(69, 71, 76, 0.3)',
  },
  passwordWrapper: { position: 'relative' },
  passwordInput: {
    width: '100%',
    height: 52,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingRight: 52,
    fontSize: 15,
    color: Colors.onSurface,
    borderWidth: 1.5,
    borderColor: 'rgba(69, 71, 76, 0.3)',
  },
  eyeBtn: { position: 'absolute', right: 16, top: 14 },
  /* Error */
  errorBanner: {
    backgroundColor: 'rgba(255, 180, 171, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 180, 171, 0.25)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  errorText: { fontSize: 13, color: Colors.error, fontWeight: '600', lineHeight: 20 },
  /* CTA */
  signInButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(234, 195, 74, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  signInButtonText: { fontSize: 16, fontWeight: '900', color: Colors.tertiary, letterSpacing: 1 },
  /* Footer */
  footer: { alignItems: 'center' },
  signUpText: { fontSize: 14, color: Colors.onSurfaceVariant, textAlign: 'center' },
  signUpLink: { fontWeight: '900', color: Colors.tertiary },
});

export default LoginScreen;
