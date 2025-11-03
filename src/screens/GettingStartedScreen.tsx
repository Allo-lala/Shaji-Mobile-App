import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';

type GettingStartedScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const GettingStartedScreen: React.FC<GettingStartedScreenProps> = ({
  navigation,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Image
          source={require("../../assets/shaji.png")} //  logo
          style={styles.logoImage}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Welcome to Shaji</Text>
        <Text style={styles.subtitle}>Academic Verification Platform</Text>

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('Home')} // replaces splash with main
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  logoImage: {
    width: 150,
    height: 150,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.displayLarge,
    color: colors.aquaDeep,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.aquaPrimary,
    borderRadius: 10,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  buttonText: {
    ...typography.bodyLarge,
    color: colors.white,
    fontWeight: '600',
  },
});
