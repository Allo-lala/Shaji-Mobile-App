import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';

type GettingStartedScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const GettingStartedScreen: React.FC<GettingStartedScreenProps> = ({
  navigation,
}) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo with fade and scale animation */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={require('../../assets/shaji.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Title with fade and slide animation */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Welcome to Shaji</Text>
          <Text style={styles.subtitle}>Academic Verification Platform</Text>
          <Text style={styles.description}>
            Secure, transparent, and decentralized document verification powered
            by Aqua Protocol
          </Text>
        </Animated.View>

        {/* Button with fade animation */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.replace('Home')}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <Animated.Text
          style={[
            styles.footer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          Powered by Aqua Protocol
        </Animated.Text>
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
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logoImage: {
    width: 150,
    height: 150,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
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
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    ...typography.bodyRegular,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: colors.aquaPrimary,
    borderRadius: 14,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.aquaPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    ...typography.bodyLarge,
    color: colors.surface,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  buttonArrow: {
    fontSize: 20,
    color: colors.surface,
    fontWeight: '600',
  },
  footer: {
    ...typography.caption,
    color: colors.textTertiary,
    position: 'absolute',
    bottom: spacing.xl,
  },
});