/**
 * xChess App
 *
 * @format
 */

import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './navigation/AppNavigator';
import { configureGoogleSignIn } from './services/auth';

function App() {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
