import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'flat';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  style,
}) => {
  return (
    <View style={[styles.card, styles[variant], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  flat: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  });