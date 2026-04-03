import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Mail, Lock, ChevronRight } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { login } from '../services/auth';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Keys', 'Please enter your grandmaster identifiers.');
      return;
    }

    setLoading(true);
    const { user, error } = await login(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Access Denied', error);
    } else {
      navigation.navigate('MainApp');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.content}
          >
            <View style={styles.headerSection}>
              <Text style={styles.title}>GRANDMASTER ACCESS</Text>
              <Text style={styles.subtitle}>Enter your sanctuary to continue the duel.</Text>
            </View>

            <View style={styles.formSection}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>ELECTRONIC MAIL</Text>
                <View style={[
                  styles.inputWrapper, 
                  isEmailFocused && styles.inputWrapperFocused
                ]}>
                  <Mail size={18} color={isEmailFocused ? Colors.tertiary : Colors.onSurfaceVariant} />
                  <TextInput
                    style={styles.input}
                    placeholder="name@grandmaster.com"
                    placeholderTextColor={Colors.surfaceContainerHighest}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>SECURITY KEY</Text>
                  <TouchableOpacity disabled={loading}>
                    <Text style={styles.forgotText}>FORGOT?</Text>
                  </TouchableOpacity>
                </View>
                <View style={[
                  styles.inputWrapper, 
                  isPasswordFocused && styles.inputWrapperFocused
                ]}>
                  <Lock size={18} color={isPasswordFocused ? Colors.tertiary : Colors.onSurfaceVariant} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={Colors.surfaceContainerHighest}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    secureTextEntry
                    editable={!loading}
                  />
                </View>
              </View>

              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={handleLogin}
                disabled={loading}
                style={styles.primaryButtonWrapper}
              >
                <View style={styles.primaryGlassButton}>
                  {loading ? (
                    <ActivityIndicator color={Colors.tertiary} />
                  ) : (
                    <>
                      <Text style={styles.primaryButtonText}>ENTER SANCTUARY</Text>
                      <ChevronRight size={20} color={Colors.tertiary} />
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.footerSection}>
              <Text style={styles.footerText}>NEW TO THE ACADEMY?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')} disabled={loading}>
                <Text style={styles.signupLink}>ENROLL AS CANDIDATE</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    lineHeight: 24,
  },
  formSection: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
  },
  forgotText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapperFocused: {
    borderColor: Colors.tertiary,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    color: Colors.onSurface,
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonWrapper: {
    marginTop: 12,
  },
  primaryGlassButton: {
    flexDirection: 'row',
    height: 60,
    borderRadius: 14,
    backgroundColor: 'rgba(234, 195, 74, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 2,
  },
  footerSection: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  signupLink: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.tertiary,
    letterSpacing: 1.5,
  },
});

export default LoginScreen;
