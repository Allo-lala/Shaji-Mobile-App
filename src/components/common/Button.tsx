import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { colors, typography, spacing } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.surface : colors.aquaPrimary}
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  primary: {
    backgroundColor: colors.aquaPrimary,
    shadowColor: colors.aquaPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.aquaPrimary,
  },
  tertiary: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    ...typography.bodyLarge,
    fontWeight: '600',
  },
  primaryText: {
    color: colors.surface,
  },
  secondaryText: {
    color: colors.aquaPrimary,
  },
  tertiaryText: {
    color: colors.aquaPrimary,
  },
});