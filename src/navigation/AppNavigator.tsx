import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Screens
import { GettingStartedScreen } from '../screens/GettingStartedScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { VerifyScreen } from '../screens/VerifyScreen';
import { UploadScreen } from '../screens/UploadScreen';
import { VerificationResultScreen } from '../screens/VerificationResultScreen';
import { VaultScreen } from '../screens/VaultScreen';
import { ShareProofScreen } from '../screens/ShareProofScreen';
import { colors } from '../theme';

export type RootStackParamList = {
  GettingStarted: undefined;
  Home: undefined;
  Verify: undefined;
  Upload: undefined;
  VerificationResult: {
    status: 'verified' | 'unverified' | 'pending' | 'error';
    document?: any;
    message?: string;
  };
  Vault: undefined;
  ShareProof: {
    document: any;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="GettingStarted"
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.aquaPrimary,
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 18,
            },
            headerShadowVisible: false,
            // headerBackTitleVisible: false,
            animation: 'slide_from_right',
          }}
        >
          {/* Getting Started Screen - First screen */}
          <Stack.Screen
            name="GettingStarted"
            component={GettingStartedScreen}
            options={{
              headerShown: false,
              animation: 'fade',
            }}
          />

          {/* Home Screen - After Getting Started */}
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: false,
              animation: 'fade',
            }}
          />

          {/* Verify Screen */}
          <Stack.Screen
            name="Verify"
            component={VerifyScreen}
            options={{
              title: 'Verify Paper',
              headerShown: true,
            }}
          />

          {/* Upload Screen */}
          <Stack.Screen
            name="Upload"
            component={UploadScreen}
            options={{
              title: 'Upload Paper',
              headerShown: true,
            }}
          />

          {/* Verification Result Screen */}
          <Stack.Screen
            name="VerificationResult"
            component={VerificationResultScreen}
            options={{
              title: 'Verification Result',
              headerShown: true,
            }}
          />

          {/* Vault Screen */}
          <Stack.Screen
            name="Vault"
            component={VaultScreen}
            options={{
              title: 'My Documents',
              headerShown: true,
            }}
          />

          {/* Share Proof Screen */}
          <Stack.Screen
            name="ShareProof"
            component={ShareProofScreen}
            options={{
              title: 'Share Proof',
              headerShown: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};