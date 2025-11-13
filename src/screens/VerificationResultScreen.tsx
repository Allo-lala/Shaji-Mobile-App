import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { colors, typography, spacing } from '../theme';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Document, DocumentStatus } from '../types';
import { useDocuments } from '../hooks/useDocuments';

type VerificationResultScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: {
    params: {
      status: DocumentStatus;
      document?: Document;
      message?: string;
    };
  };
};

export const VerificationResultScreen: React.FC<VerificationResultScreenProps> = ({
  navigation,
  route,
}) => {
  const { status, document, message } = route.params;
  const { saveDocument } = useDocuments();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Success animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
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
        title: 'Authentic',
        color: colors.success,
        bg: colors.successBg,
        message: 'This document is verified and unmodified',
      },
      unverified: {
        icon: '⚠️',
        title: 'Unverified',
        color: colors.warning,
        bg: colors.warningBg,
        message: 'No verification record found for this document',
      },
      error: {
        icon: '✕',
        title: 'Error',
        color: colors.error,
        bg: colors.errorBg,
        message: 'Verification failed',
      },
      pending: {
        icon: '⟳',
        title: 'Pending',
        color: colors.warning,
        bg: colors.warningBg,
        message: 'Verification in progress',
      },
    };
    return configs[status];
  };

  const config = getStatusConfig();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSaveToVault = async () => {
    if (!document) {
      Alert.alert('Error', 'No document to save');
      return;
    }

    try {
      const success = await saveDocument(document);
      if (success) {
        Alert.alert(
          'Saved!',
          'Document has been saved to your vault',
          [
            {
              text: 'View Vault',
              onPress: () => navigation.navigate('Vault'),
            },
            { text: 'OK' },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save document');
    }
  };

  const handleShareProof = () => {
    if (!document) {
      Alert.alert('Error', 'No document to share');
      return;
    }
    navigation.navigate('ShareProof', { document });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Status Icon */}
          <Animated.View
            style={[
              styles.statusIconContainer,
              { backgroundColor: config.color },
              {
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={styles.statusIcon}>{config.icon}</Text>
          </Animated.View>

          {/* Status Title */}
          <Animated.Text
            style={[
              styles.statusTitle,
              { color: config.color, opacity: fadeAnim },
            ]}
          >
            {config.title}
          </Animated.Text>

          {/* Status Message */}
          <Animated.Text style={[styles.statusMessage, { opacity: fadeAnim }]}>
            {message || config.message}
          </Animated.Text>

          {/* Document Details - Only for verified documents */}
          {status === 'verified' && document && (
            <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
              <Card style={styles.detailsCard}>
                <Text style={styles.cardTitle}>📄 Document Details</Text>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Title:</Text>
                  <Text style={styles.detailValue} numberOfLines={2}>
                    {document.title}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>👤 Author:</Text>
                  <Text style={styles.detailValue}>{document.author}</Text>
                </View>

                {document.institution && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>🏛️  Institution:</Text>
                      <Text style={styles.detailValue}>{document.institution}</Text>
                    </View>
                  </>
                )}

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>⏰ Notarized:</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(document.timestamp)}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>🔗 Hash:</Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.hashValue} numberOfLines={1}>
                      {document.hash}
                    </Text>
                  </TouchableOpacity>
                </View>

                {document.witnesses && document.witnesses > 0 && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>👥 Witnesses:</Text>
                      <Text style={styles.detailValue}>
                        {document.witnesses} Network confirmations
                      </Text>
                    </View>
                  </>
                )}
              </Card>
            </Animated.View>
          )}

          {/* Unverified Info */}
          {status === 'unverified' && (
            <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
              <Card style={styles.unverifiedCard}>
                <Text style={styles.unverifiedTitle}>
                  This document may be:
                </Text>
                <Text style={styles.unverifiedItem}>• Not yet notarized</Text>
                <Text style={styles.unverifiedItem}>
                  • Modified after notarization
                </Text>
                <Text style={styles.unverifiedItem}>
                  • Using invalid credentials
                </Text>
              </Card>
            </Animated.View>
          )}

          {/* Action Buttons */}
          <Animated.View style={[styles.actions, { opacity: fadeAnim }]}>
            {status === 'verified' && document && (
              <>
                <Button
                  title="📤 Share Proof"
                  onPress={handleShareProof}
                />
                <Button
                  title="📥 Save to Vault"
                  onPress={handleSaveToVault}
                  variant="secondary"
                />
              </>
            )}

            {status === 'unverified' && (
              <Button
                title="🔐 Notarize This Document"
                onPress={() => navigation.navigate('Upload')}
              />
            )}

            <Button
              title="← Back to Home"
              onPress={() => navigation.navigate('Home')}
              variant="tertiary"
            />
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  statusIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  statusIcon: {
    fontSize: 40,
    color: colors.surface,
  },
  statusTitle: {
    ...typography.headline1,
    marginBottom: spacing.md,
  },
  statusMessage: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  detailsCard: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  cardTitle: {
    ...typography.headline2,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
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
    ...typography.bodyLarge,
    color: colors.aquaPrimary,
    fontFamily: 'Courier',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  unverifiedCard: {
    width: '100%',
    marginBottom: spacing.xl,
    backgroundColor: colors.warningBg,
  },
  unverifiedTitle: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  unverifiedItem: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
    marginVertical: spacing.xs,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
});