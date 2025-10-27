import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import aquaService from './src/services/aquaService';
import { colors } from './src/theme';

function App(): React.JSX.Element {
  useEffect(() => {
    // Initialize Aqua SDK on app start
    aquaService.initialize();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />
      <AppNavigator />
    </GestureHandlerRootView>
  );
}

export default App;