import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const GlassCard = ({ children, style }: GlassCardProps) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(49, 57, 77, 0.4)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(69, 71, 76, 0.2)',
    padding: 16,
    overflow: 'hidden',
  },
});
