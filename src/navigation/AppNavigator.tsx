import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainTabNavigator from './MainTabNavigator';
import ChessBoardScreen from '../screens/ChessBoardScreen';
import MatchFoundScreen from '../screens/MatchFoundScreen';
import GameOverScreen from '../screens/GameOverScreen';
import FriendsListScreen from '../screens/FriendsListScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  MainApp: undefined; // This will point to our Bottom Tab Navigator
  ChessBoard: { gameId: string };
  MatchFound: { opponent: string; mode: string };
  GameOver: { result: string; eloChange: string };
  FriendsList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
        }}
      >
        {/* Auth Group */}
        <Stack.Group>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Group>

        {/* Global Main App (Tabs) */}
        <Stack.Screen name="MainApp" component={MainTabNavigator} />

        {/* Global Overlays / Fullscreen (Matches) */}
        {/* Note: In a real app with 'fixed' tabs, these might be nested within the Play tab */}
        <Stack.Group screenOptions={{ presentation: 'fullScreenModal' }}>
          <Stack.Screen name="MatchFound" component={MatchFoundScreen} />
          <Stack.Screen name="ChessBoard" component={ChessBoardScreen} />
          <Stack.Screen name="GameOver" component={GameOverScreen} />
          <Stack.Screen name="FriendsList" component={FriendsListScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
