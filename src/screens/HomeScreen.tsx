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

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/shaji.png")} // logo here
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Shaji</Text>
        <Text style={styles.subtitle}>Academic Verification</Text>
        <Text style={styles.tagline}>
          Decentralized trust for academic integrity
        </Text>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Verify')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>📄</Text>
            <Text style={styles.actionText}>Verify Paper</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Upload')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>⬆️</Text>
            <Text style={styles.actionText}>Upload Paper</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Vault')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>🗂️</Text>
            <Text style={styles.actionText}>My Documents</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Powered by Aqua Protocol</Text>
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
    paddingHorizontal: spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  title: {
    ...typography.displayLarge,
    color: colors.aquaDeep,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  tagline: {
    ...typography.bodyRegular,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
  },
  actions: {
    width: '100%',
    gap: spacing.lg,
  },
  actionButton: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    shadowColor: colors.aquaPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  actionText: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  footer: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xxxl,
  },
});
