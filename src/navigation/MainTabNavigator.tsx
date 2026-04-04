import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../theme/colors';
import { Home, Users, Trophy, BookOpen, User, Zap } from 'lucide-react-native';

// Screens for Tabs
import HomeScreen from '../screens/HomeScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import MatchmakingScreen from '../screens/MatchmakingScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import AcademyScreen from '../screens/AcademyScreen';

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

const MainTabNavigator = () => {
  return (
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
            <View style={[styles.playIconWrap, focused && styles.playIconWrapActive]}>
              <Zap size={24} color={focused ? Colors.onTertiary : Colors.tertiary} strokeWidth={2} />
            </View>
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
        name="Profile"
        component={UserProfileScreen}
        options={{
          tabBarLabel: 'PROFILE',
          tabBarIcon: ({ focused }) => <TabIcon icon={User} focused={focused} label="Profile" />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainer,
    elevation: 0,
    height: 90,
    paddingBottom: 24,
    paddingTop: 8,
    // shadow for depth
    shadowColor: Colors.background,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 1,
    shadowRadius: 24,
  },
  tabBarLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  tabIconWrap: {
    width: 40,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  tabIconWrapActive: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  /* ♟ Play center icon */
  playIconWrap: {
    width: 48,
    height: 36,
    borderRadius: 14,
    backgroundColor: 'rgba(234, 195, 74, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconWrapActive: {
    backgroundColor: Colors.tertiary,
    borderColor: Colors.tertiary,
  },
});

export default MainTabNavigator;
