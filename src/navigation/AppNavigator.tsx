import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { UploadScreen } from '../screens/UploadScreen';
import { VerificationResultScreen } from '../screens/VerificationResultScreen';
import { VaultScreen } from '../screens/VaultScreen';
import { ShareProofScreen } from '../screens/ShareProofScreen';
import { colors } from '../theme';
import type { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.aquaPrimary,
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Upload"
          component={UploadScreen}
          options={{ title: 'Upload Paper' }}
        />
        <Stack.Screen
          name="VerificationResult"
          component={VerificationResultScreen}
          options={{ title: 'Verification Result' }}
        />
        <Stack.Screen
          name="Vault"
          component={VaultScreen}
          options={{ title: 'My Documents' }}
        />
        <Stack.Screen
          name="ShareProof"
          component={ShareProofScreen}
          options={{ title: 'Share Proof' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
