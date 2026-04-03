import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { Colors } from '../theme/colors';

const LoginScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtext}>Sign in to continue your Grandmaster journey.</Text>
        
        <View style={styles.form}>
          <TextInput 
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor={Colors.onSurfaceVariant}
          />
          <TextInput 
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.onSurfaceVariant}
            secureTextEntry
          />
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('MainApp')}
          >
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkHighlight}>Sign Up</Text></Text>
        </TouchableOpacity>
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
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.onSurface,
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    marginBottom: 48,
  },
  form: {
    gap: 16,
    marginBottom: 32,
  },
  input: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 16,
    color: Colors.onSurface,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: Colors.tertiary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onTertiary,
  },
  linkText: {
    textAlign: 'center',
    color: Colors.onSurfaceVariant,
    fontSize: 14,
  },
  linkHighlight: {
    color: Colors.tertiary,
    fontWeight: '700',
  },
});

export default LoginScreen;
