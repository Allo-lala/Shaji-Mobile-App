import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { colors, typography, spacing } from '../../theme';
import { Card } from '../common/Card';
import { DocumentStatus } from '../../types';


interface VerificationResultProps {
  status: DocumentStatus;
  message: string;
  details?: {
    author?: string;
    institution?: string;
    timestamp?: number;
    hash?: string;
    witnesses?: number;
  };
  onViewDetails?: () => void;
}

export const VerificationResult: React.FC<VerificationResultProps> = ({
  status,
  message,
  details,
  onViewDetails,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Haptic feedback
    if (status === 'verified') {
      ReactNativeHapticFeedback.trigger('notificationSuccess');
    } else if (status === 'unverified' || status === 'error') {
      ReactNativeHapticFeedback.trigger('notificationWarning');
    }
  }, [status]);

  const getStatusConfig = () => {
    const configs = {
      verified: {
        icon: '✓',
        title: 'Verified',
        color: colors.success,
        bg: colors.successBg,
      },
      unverified: {
        icon: '⚠️',
        title: 'Unverified',
        color: colors.warning,
        bg: colors.warningBg,
      },
      pending: {
        icon: '⟳',
        title: 'Pending',
        color: colors.warning,
        bg: colors.warningBg,
      },
      error: {
        icon: '✕',
        title: 'Error',
        color: colors.error,
        bg: colors.errorBg,
      },
    };
    return configs[status];
  };

  const config = getStatusConfig();

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Status Icon */}
      <View style={[styles.iconContainer, { backgroundColor: config.color }]}>
        <Text style={styles.icon}>{config.icon}</Text>
      </View>

      {/* Status Title */}
      <Text style={[styles.title, { color: config.color }]}>
        {config.title}
      </Text>

      {/* Message */}
      <Text style={styles.message}>{message}</Text>

      {/* Details Card */}
      {details && status === 'verified' && (
        <Card style={styles.detailsCard}>
          {details.author && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Author</Text>
              <Text style={styles.detailValue}>{details.author}</Text>
            </View>
          )}

          {details.institution && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Institution</Text>
                <Text style={styles.detailValue}>{details.institution}</Text>
              </View>
            </>
          )}

          {details.timestamp && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Notarized</Text>
                <Text style={styles.detailValue}>
                  {formatTimestamp(details.timestamp)}
                </Text>
              </View>
            </>
          )}

          {details.hash && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Hash</Text>
                <Text style={styles.hashValue} numberOfLines={1}>
                  {details.hash}
                </Text>
              </View>
            </>
          )}

          {details.witnesses && details.witnesses > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Witnesses</Text>
                <Text style={styles.detailValue}>
                  {details.witnesses} confirmations
                </Text>
              </View>
            </>
          )}

          {onViewDetails && (
            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={onViewDetails}
            >
              <Text style={styles.viewDetailsText}>View Full Details →</Text>
            </TouchableOpacity>
          )}
        </Card>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 40,
    color: colors.surface,
  },
  title: {
    ...typography.headline1,
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  detailsCard: {
    width: '100%',
    marginTop: spacing.lg,
  },
  detailRow: {
    marginVertical: spacing.sm,
  },
  detailLabel: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  detailValue: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  hashValue: {
    ...typography.bodyRegular,
    color: colors.aquaPrimary,
    fontFamily: 'Courier',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  viewDetailsButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  viewDetailsText: {
    ...typography.bodyLarge,
    color: colors.aquaPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
});