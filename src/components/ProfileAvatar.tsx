import React from 'react';
import { View } from 'react-native';
import * as Icons from 'lucide-react-native';
import { Colors } from '../theme/colors';

interface ProfileAvatarProps {
  iconName?: string;
  size?: number;
  containerSize?: number;
  color?: string;
  isGold?: boolean;
}

export const ProfileAvatar = ({
  iconName = 'Award',
  size = 32,
  containerSize,
  color,
  isGold = false
}: ProfileAvatarProps) => {
  // Safe lookup for the icon
  const IconComponent = (Icons as any)[iconName] || Icons.Award;
  const finalColor = color || (isGold ? Colors.tertiary : Colors.onSurfaceVariant);
  const finalContainerSize = containerSize || size * 1.8;

  return (
    <View style={{
      width: finalContainerSize,
      height: finalContainerSize,
      margin: 0,
      borderRadius: finalContainerSize / 3,
      backgroundColor: isGold ? 'rgba(234, 195, 74, 0.08)' : Colors.surfaceContainerHighest,
      borderColor: isGold ? 'rgba(234, 195, 74, 0.35)' : 'rgba(255,255,255,0.05)',
      justifyContent: 'center',
      borderWidth: 2,
      alignItems: 'center',
    }}>
      <IconComponent size={size} color={finalColor} />
    </View>
  );
};
