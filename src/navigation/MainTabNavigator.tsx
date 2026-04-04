import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { Colors } from '../theme/colors';
import { Home, Trophy, BookOpen, User, Zap } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Screens for Tabs
import HomeScreen from '../screens/HomeScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import MatchmakingScreen from '../screens/MatchmakingScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import AcademyScreen from '../screens/AcademyScreen';

import { TopBar } from '../components/navigation/TopBar';
import { getCurrentUser, getUserProfile } from '../services/auth';

const Tab = createBottomTabNavigator();

const TabIcon = ({ icon: Icon, focused, label }: { icon: any; focused: boolean; label: string }) => (
  <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
    <Icon
      size={22}
      color={focused ? Colors.tertiary : Colors.onSurfaceVariant}
      strokeWidth={focused ? 2.5 : 1.8}
    />
  </View>
);

const MainTabNavigator = ({ navigation }: any) => {
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const unsub = getUserProfile(user.uid, setUserProfile);
      return () => unsub();
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <TopBar
          userProfile={userProfile}
          onProfilePress={() => navigation.navigate('Profile')}
        />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: Colors.tertiary,
            tabBarInactiveTintColor: Colors.onSurfaceVariant,
            tabBarShowLabel: true,
            tabBarLabelStyle: styles.tabBarLabel,
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: 'HOME',
              tabBarIcon: ({ focused }) => <TabIcon icon={Home} focused={focused} label="Home" />,
            }}
          />
          <Tab.Screen
            name="Social"
            component={LeaderboardScreen}
            options={{
              tabBarLabel: 'RANKINGS',
              tabBarIcon: ({ focused }) => <TabIcon icon={Trophy} focused={focused} label="Rankings" />,
            }}
          />
          <Tab.Screen
            name="Play"
            component={MatchmakingScreen}
            initialParams={{ mode: 'Blitz' }}
            options={{
              tabBarLabel: 'PLAY',
              tabBarIcon: ({ focused }) => (
                <Zap size={28} color={focused ? Colors.onTertiary : Colors.tertiary} strokeWidth={2.5} />
              ),
            }}
          />
          <Tab.Screen
            name="Academy"
            component={AcademyScreen}
            options={{
              tabBarLabel: 'ACADEMY',
              tabBarIcon: ({ focused }) => <TabIcon icon={BookOpen} focused={focused} label="Academy" />,
            }}
          />
          <Tab.Screen
            name="ProfileTab"
            component={UserProfileScreen}
            options={{
              tabBarLabel: 'PROFILE',
              tabBarIcon: ({ focused }) => <TabIcon icon={User} focused={focused} label="Profile" />,
            }}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surfaceContainerLowest, // Real theme background
    borderTopWidth: 1.5,
    borderTopColor: Colors.surfaceContainer, // Real theme container color
    elevation: 0,
    height: 94,
    paddingBottom: 32,
    paddingTop: 12,
    paddingHorizontal: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    // Polished shadow for depth
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
  },
  tabBarLabel: {
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 1,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  tabIconWrap: {
    width: 44,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  tabIconWrapActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  /* ♟ Play center icon — High-Action Gold Glow */
  playIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: 'rgba(234, 195, 74, 0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -10 }], // Raised effect
    shadowColor: Colors.tertiary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  playIconWrapActive: {
    backgroundColor: Colors.tertiary,
    borderColor: Colors.tertiary,
    transform: [{ translateY: -18 }, { scale: 1.05 }],
    shadowColor: Colors.tertiary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
});

export default MainTabNavigator;
