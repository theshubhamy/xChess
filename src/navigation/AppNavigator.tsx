import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { getAuth, onAuthStateChanged, FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Colors } from '../theme/colors';

// Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainTabNavigator from './MainTabNavigator';
import ChessBoardScreen from '../screens/ChessBoardScreen';
import MatchFoundScreen from '../screens/MatchFoundScreen';
import GameOverScreen from '../screens/GameOverScreen';
import FriendsListScreen from '../screens/FriendsListScreen';
import MatchmakingScreen from '../screens/MatchmakingScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  MainApp: undefined;
  Matchmaking: { mode: string };
  ChessBoard: { gameId: string; isAi?: boolean; mode?: string };
  MatchFound: { opponent: string; mode: string };
  GameOver: { result: string; eloChange: number; isVictory?: boolean; opponent?: string };
  FriendsList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  function handleAuthUserChange(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    // Safety timeout: if auth hasn't initialization within 6s (e.g. network/native sync hang),
    // we bypass it so the user can at least see the login/error state.
    const timer = setTimeout(() => {
      setInitializing(false);
    }, 6000);

    const subscriber = onAuthStateChanged(getAuth(), (u) => {
      handleAuthUserChange(u);
      clearTimeout(timer);
    });
    
    return () => {
      subscriber();
      clearTimeout(timer);
    };
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.tertiary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
        }}
      >
        {user ? (
          // Authenticated Stack
          <>
            <Stack.Group>
              <Stack.Screen name="MainApp" component={MainTabNavigator} />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: 'fullScreenModal' }}>
              <Stack.Screen name="Matchmaking" component={MatchmakingScreen} />
              <Stack.Screen name="MatchFound" component={MatchFoundScreen} />
              <Stack.Screen name="ChessBoard" component={ChessBoardScreen} />
              <Stack.Screen name="GameOver" component={GameOverScreen} />
              <Stack.Screen name="FriendsList" component={FriendsListScreen} />
            </Stack.Group>
          </>
        ) : (
          // Unauthenticated Stack
          <Stack.Group>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
