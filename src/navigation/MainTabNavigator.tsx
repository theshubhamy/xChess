import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../theme/colors';

// Screens for Tabs
import HomeScreen from '../screens/HomeScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import MatchmakingScreen from '../screens/MatchmakingScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import AcademyScreen from '../screens/AcademyScreen';


const Tab = createBottomTabNavigator();

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
          // Icons would go here
        }}
      />
      <Tab.Screen 
        name="Social" 
        component={LeaderboardScreen} 
        options={{
          tabBarLabel: 'SOCIAL',
        }}
      />
      <Tab.Screen 
        name="Play" 
        component={MatchmakingScreen} 
        initialParams={{ mode: 'Blitz' }}
        options={{
          tabBarLabel: 'PLAY',
        }}
      />
      <Tab.Screen 
        name="Academy" 
        component={AcademyScreen} 
        options={{
          tabBarLabel: 'ACADEMY',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={UserProfileScreen} 
        options={{
          tabBarLabel: 'PROFILE',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surfaceContainer,
    borderTopWidth: 0,
    elevation: 0,
    height: 90,
    paddingBottom: 30,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
});

export default MainTabNavigator;
