import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';

const SignUpScreen = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Join the Grandmasters</Text>
        <Text style={styles.subtext}>Create your account to track Elo and challenge friends.</Text>
        
        <View style={styles.form}>
          <TextInput 
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={Colors.onSurfaceVariant}
          />
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
          <TextInput 
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={Colors.onSurfaceVariant}
            secureTextEntry
          />
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('MainApp')}
          >
            <Text style={styles.primaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already a member? <Text style={styles.linkHighlight}>Sign In</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 80,
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
    marginBottom: 40,
  },
  linkHighlight: {
    color: Colors.tertiary,
    fontWeight: '700',
  },
});

export default SignUpScreen;
