import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';
import { DocumentStatus } from '../../types';

interface BadgeProps {
  status: DocumentStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const config = {
    verified: {
      bg: colors.successBg,
      text: colors.successText,
      label: '✓ Verified',
    },
    unverified: {
      bg: colors.errorBg,
      text: colors.errorText,
      label: '⚠️  Unverified',
    },
    pending: {
      bg: colors.warningBg,
      text: colors.warningText,
      label: '⟳ Pending',
    },
    error: {
      bg: colors.errorBg,
      text: colors.errorText,
      label: '✕ Error',
    },
  };

  const { bg, text, label } = config[status];

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.caption,
    fontWeight: '600',
  },
});