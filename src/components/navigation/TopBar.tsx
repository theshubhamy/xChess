import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Zap } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { ProfileAvatar } from '../ProfileAvatar';

interface TopBarProps {
  userProfile?: any;
  onProfilePress?: () => void;
  title?: string;
  showAvatar?: boolean;
}

export const TopBar = ({
  userProfile,
  onProfilePress,
  title = "xChess",
}: TopBarProps) => {
  return (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        <View style={styles.menuBtn}>
          <Zap size={20} color={Colors.primary} />
        </View>
        <Text style={styles.brandName}>
          <Text style={{ color: '#FFFFFF' }}>x</Text>
          <Text style={{ color: Colors.tertiary }}>Chess</Text>
        </Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: Colors.background,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(69, 71, 76, 0.2)',
  },
  brandName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
    fontStyle: 'italic',
  },
  avatarRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: 'rgba(69, 71, 76, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
