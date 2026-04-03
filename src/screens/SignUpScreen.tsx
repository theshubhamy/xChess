import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { signUp } from '../services/auth';

const SignUpScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert('Incomplete Credential', 'Please provide your academy identifiers.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Key Mismatch', 'Your security keys do not correspond.');
      return;
    }

    setLoading(true);
    const { user, error } = await signUp(email, password, username);
    setLoading(false);

    if (error) {
      Alert.alert('Entry Denied', error);
    } else {
      navigation.navigate('MainApp');
    }
  };

  const renderInput = (
    label: string, 
    value: string, 
    onChange: (t: string) => void, 
    placeholder: string, 
    Icon: any, 
    id: string,
    secure = false
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputWrapper, 
        focusedField === id && styles.inputWrapperFocused
      ]}>
        <Icon size={18} color={focusedField === id ? Colors.tertiary : Colors.onSurfaceVariant} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.surfaceContainerHighest}
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocusedField(id)}
          onBlur={() => setFocusedField(null)}
          secureTextEntry={secure}
          autoCapitalize={id === 'email' ? 'none' : 'words'}
          editable={!loading}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
          >
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.headerSection}>
                <Text style={styles.title}>CREATE YOUR CREST</Text>
                <Text style={styles.subtitle}>Enroll in the Grandmaster Academy to track your ascent.</Text>
              </View>

              <View style={styles.formSection}>
                {renderInput('PLAYER NAME', username, setUsername, 'Grandmaster Vance', User, 'user')}
                {renderInput('ELECTRONIC MAIL', email, setEmail, 'name@grandmaster.com', Mail, 'email')}
                {renderInput('SECURITY KEY', password, setPassword, '••••••••', Lock, 'pass', true)}
                {renderInput('CONFIRM KEY', confirmPassword, setConfirmPassword, '••••••••', ShieldCheck, 'confirm', true)}

                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={handleSignUp}
                  disabled={loading}
                  style={styles.primaryButtonWrapper}
                >
                  <View style={styles.primaryGlassButton}>
                    {loading ? (
                      <ActivityIndicator color={Colors.tertiary} />
                    ) : (
                      <Text style={styles.primaryButtonText}>ENROLL NOW</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.footerSection}>
                <Text style={styles.footerText}>ALREADY A GRANDMASTER?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
                  <Text style={styles.loginLink}>RE-ENTER THE SANCTUARY</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
  },
  headerSection: {
    marginBottom: 40,
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
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
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
    height: 60,
    borderRadius: 14,
    backgroundColor: 'rgba(234, 195, 74, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 2,
  },
  footerSection: {
    marginTop: 48,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.tertiary,
    letterSpacing: 1.5,
  },
});

export default SignUpScreen;
